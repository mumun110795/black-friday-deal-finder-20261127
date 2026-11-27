// Page wiring. One job: own the filter state, build the controls from the
// data (so the shelves can never drift from the deals), render the grid and
// the comparison section, and keep the address-bar hash in step so any view
// can be linked, refreshed or photographed exactly as it stands.

import { CHECKED_LABEL, COMPARE_GROUPS, DEALS } from '../data/deals.js';
import {
  applyFilters,
  categoriesOf,
  filtersFromHash,
  hashFromFilters,
  storesOf,
} from './filters.js';
import { renderCompare, renderGrid } from './render.js';
import { verdictCounts } from './verdicts.js';

const state = filtersFromHash(location.hash);
const startAtCompare = new URLSearchParams(location.hash.replace(/^#\/?/, '')).get('view') === 'compare';

const grid = document.getElementById('deal-grid');
const resultCount = document.getElementById('result-count');
const searchInput = document.getElementById('search-input');
const storeSelect = document.getElementById('store-select');
const discountSelect = document.getElementById('discount-select');
const sortSelect = document.getElementById('sort-select');
const chipRow = document.getElementById('category-chips');

function buildChips() {
  chipRow.textContent = '';
  for (const category of ['All', ...categoriesOf(DEALS)]) {
    const count = category === 'All' ? DEALS.length : DEALS.filter((d) => d.category === category).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (state.category === category ? ' is-active' : '');
    chip.textContent = category + ' (' + count + ')';
    chip.addEventListener('click', () => {
      state.category = category;
      refresh();
    });
    chipRow.append(chip);
  }
}

function buildStoreOptions() {
  storeSelect.textContent = '';
  for (const store of ['All', ...storesOf(DEALS)]) {
    const option = document.createElement('option');
    option.value = store;
    option.textContent = store === 'All' ? 'All stores' : store;
    storeSelect.append(option);
  }
  storeSelect.value = state.store;
}

function syncControls() {
  searchInput.value = state.query;
  storeSelect.value = state.store;
  discountSelect.value = String(state.minDiscount);
  sortSelect.value = state.sort;
  for (const chip of chipRow.children) {
    chip.classList.toggle('is-active', chip.textContent.startsWith(state.category + ' ('));
  }
}

function refresh() {
  const visible = applyFilters(DEALS, state);
  renderGrid(grid, visible);
  resultCount.textContent =
    'Showing ' + visible.length + ' of ' + DEALS.length + ' checked deals';
  const nextHash = hashFromFilters(state);
  if (location.hash !== nextHash) history.replaceState(null, '', nextHash);
  buildChips();
  syncControls();
}

function fillStats() {
  const counts = verdictCounts(DEALS);
  const stats = document.getElementById('stat-strip');
  const items = [
    DEALS.length + ' deals checked',
    categoriesOf(DEALS).length + ' categories',
    storesOf(DEALS).length + ' stores',
    counts['new-low'] + ' new lows',
    counts.strong + ' strong prices',
    counts.routine + ' routine sales, called routine',
  ];
  stats.textContent = items.join('  ·  ');
  document.getElementById('checked-stamp').textContent = CHECKED_LABEL;
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value.trim();
  refresh();
});
storeSelect.addEventListener('change', () => {
  state.store = storeSelect.value;
  refresh();
});
discountSelect.addEventListener('change', () => {
  state.minDiscount = Number(discountSelect.value) || 0;
  refresh();
});
sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  refresh();
});

buildStoreOptions();
fillStats();
renderCompare(document.getElementById('compare-list'), COMPARE_GROUPS);
refresh();

if (startAtCompare) {
  // A shareable comparisons-only view (#view=compare): the shelf steps aside
  // so the cross-store table is the whole page.
  document.body.classList.add('compare-focus');
  window.scrollTo(0, 0);
}

// Search, filtering and sorting. One job: given the full deal list and the
// shopper's current choices, produce the deals they should see, in the order
// they asked for. The page's controls and the address-bar hash both feed the
// same filter state, so a link can carry a view (handy for sharing a shelf).

import { discountPct, savingAmount } from './format.js';

export function emptyFilters() {
  return { query: '', category: 'All', store: 'All', minDiscount: 0, sort: 'discount' };
}

export function categoriesOf(deals) {
  return [...new Set(deals.map((d) => d.category))];
}

export function storesOf(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}

export function matchesFilters(deal, filters) {
  if (filters.category !== 'All' && deal.category !== filters.category) return false;
  if (filters.store !== 'All' && deal.store !== filters.store) return false;
  if (discountPct(deal) < filters.minDiscount) return false;
  if (filters.query) {
    const haystack = (deal.product + ' ' + deal.store + ' ' + deal.category).toLowerCase();
    if (!haystack.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

const SORTERS = {
  discount: (a, b) => discountPct(b) - discountPct(a) || savingAmount(b) - savingAmount(a),
  saving: (a, b) => savingAmount(b) - savingAmount(a),
  'price-low': (a, b) => a.sale - b.sale,
  'price-high': (a, b) => b.sale - a.sale,
};

export function applyFilters(deals, filters) {
  const sorter = SORTERS[filters.sort] || SORTERS.discount;
  return deals.filter((deal) => matchesFilters(deal, filters)).sort(sorter);
}

export function filtersFromHash(hash) {
  const filters = emptyFilters();
  const params = new URLSearchParams((hash || '').replace(/^#\/?/, ''));
  if (params.get('q')) filters.query = params.get('q');
  if (params.get('cat')) filters.category = params.get('cat');
  if (params.get('store')) filters.store = params.get('store');
  if (params.get('min')) filters.minDiscount = Number(params.get('min')) || 0;
  if (params.get('sort')) filters.sort = params.get('sort');
  return filters;
}

export function hashFromFilters(filters) {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.category !== 'All') params.set('cat', filters.category);
  if (filters.store !== 'All') params.set('store', filters.store);
  if (filters.minDiscount) params.set('min', String(filters.minDiscount));
  if (filters.sort !== 'discount') params.set('sort', filters.sort);
  const text = params.toString();
  return text ? '#' + text : '#/';
}

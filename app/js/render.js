// Rendering. One job: turn deals into the cards, shelves and comparison rows
// a shopper sees. Every card shows the whole evidence chain for its deal —
// product, store, both prices, the discount they imply, the verdict, the check
// time and the source — because a deal finder earns trust card by card.

import { CHECKED_AT, DEALS } from '../data/deals.js';
import { discountPct, money, savingLabel, shortSource } from './format.js';
import { verdictOf } from './verdicts.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function dealCard(deal) {
  const verdict = verdictOf(deal);
  const card = el('article', 'deal-card');

  const top = el('div', 'card-top');
  top.append(el('span', 'store-chip', deal.store));
  top.append(el('span', 'pct-badge', '-' + discountPct(deal) + '%'));
  card.append(top);

  card.append(el('h3', 'product-name', deal.product));

  const prices = el('div', 'price-row');
  prices.append(el('span', 'sale-price', money(deal.sale)));
  prices.append(el('span', 'usual-price', money(deal.usual)));
  prices.append(el('span', 'save-label', savingLabel(deal)));
  card.append(prices);

  const verdictRow = el('div', 'verdict-row');
  const badge = el('span', 'verdict-badge ' + verdict.className, verdict.label);
  verdictRow.append(badge);
  verdictRow.append(el('span', 'category-label', deal.category));
  card.append(verdictRow);

  card.append(el('p', 'deal-note', deal.note));

  const foot = el('div', 'card-foot');
  foot.append(el('span', 'checked-label', 'Checked ' + CHECKED_AT));
  foot.append(el('span', 'source-label', 'Source: ' + shortSource(deal.source)));
  card.append(foot);

  const link = el('a', 'store-link', 'View at ' + deal.store + ' \u2192');
  link.href = deal.url;
  link.target = '_blank';
  link.rel = 'noopener';
  card.append(link);

  return card;
}

export function renderGrid(container, deals) {
  container.textContent = '';
  if (deals.length === 0) {
    container.append(el('p', 'empty-note', 'No deals match those filters yet. Loosen a filter and the shelf fills again.'));
    return;
  }
  for (const deal of deals) container.append(dealCard(deal));
}

export function cheapestIds(group, byId) {
  const prices = group.dealIds.map((id) => byId.get(id).sale);
  const min = Math.min(...prices);
  return group.dealIds.filter((id) => byId.get(id).sale === min);
}

export function renderCompare(container, groups) {
  const byId = new Map(DEALS.map((d) => [d.id, d]));
  container.textContent = '';
  for (const group of groups) {
    const winners = cheapestIds(group, byId);
    const tied = winners.length > 1;
    const block = el('section', 'compare-block');
    block.append(el('h3', 'compare-title', group.product));
    block.append(el('p', 'compare-blurb', group.blurb));

    const table = el('div', 'compare-rows');
    for (const id of group.dealIds) {
      const deal = byId.get(id);
      const verdict = verdictOf(deal);
      const row = el('div', 'compare-row' + (winners.includes(id) ? ' is-lowest' : ''));
      row.append(el('span', 'compare-store', deal.store));
      row.append(el('span', 'compare-sale', money(deal.sale)));
      row.append(el('span', 'compare-usual', money(deal.usual)));
      row.append(el('span', 'compare-pct', '-' + discountPct(deal) + '%'));
      row.append(el('span', 'verdict-badge ' + verdict.className, verdict.label));
      if (winners.includes(id)) {
        row.append(el('span', 'lowest-tag', tied ? 'Tied lowest' : 'Lowest price'));
      }
      const link = el('a', 'compare-link', 'View \u2192');
      link.href = deal.url;
      link.target = '_blank';
      link.rel = 'noopener';
      row.append(link);
      table.append(row);
    }
    block.append(table);
    container.append(block);
  }
}

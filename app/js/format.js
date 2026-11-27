// Money, discount and label formatting for Cartwise. One job: turn the raw
// numbers in the deal data into the strings a shopper reads, so the arithmetic
// shown on every card comes from exactly one place.

export function money(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function discountPct(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function savingAmount(deal) {
  return Math.round((deal.usual - deal.sale) * 100) / 100;
}

export function savingLabel(deal) {
  return 'Save ' + money(savingAmount(deal));
}

// The sources credited on the cards are the publications where each price was
// read; the card footer shows the short name, the data file keeps the full one.
const SHORT_SOURCES = [
  ['Mashable', 'Mashable'],
  ['Benzinga', 'Benzinga'],
  ['CNN Underscored', 'CNN Underscored'],
  ['AislePrompt', 'AislePrompt'],
  ['DealNews', 'DealNews'],
  ['MamaCheaps', 'MamaCheaps'],
  ['Wirecutter', 'Wirecutter'],
  ['WIRED', 'WIRED'],
  ['Pete Matheson', 'Pete Matheson'],
];

export function shortSource(source) {
  for (const [prefix, short] of SHORT_SOURCES) {
    if (source.startsWith(prefix)) return short;
  }
  return source;
}

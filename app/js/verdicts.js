// The honest-signal system. Every deal carries one of three verdicts, assigned
// when the deal was checked, and this file owns what each verdict is called,
// how it is coloured, and what it promises the shopper.

export const VERDICTS = {
  'new-low': {
    label: 'New low',
    className: 'verdict-new-low',
    meaning: 'The lowest price we or the cited source have tracked for it.',
  },
  'strong': {
    label: 'Strong price',
    className: 'verdict-strong',
    meaning: 'A genuinely deep cut against the usual price.',
  },
  'routine': {
    label: 'Routine sale',
    className: 'verdict-routine',
    meaning: 'A normal sale price; fine to buy, no need to rush.',
  },
};

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] || VERDICTS.routine;
}

export function verdictCounts(deals) {
  const counts = { 'new-low': 0, 'strong': 0, 'routine': 0 };
  for (const deal of deals) {
    if (counts[deal.verdict] !== undefined) counts[deal.verdict] += 1;
  }
  return counts;
}

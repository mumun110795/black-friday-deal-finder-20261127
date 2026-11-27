# black-friday-deal-finder-20261127

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/mumun110795/black-friday-deal-finder-20261127/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/mumun110795/black-friday-deal-finder-20261127/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**Cartwise** — a Black Friday 2026 deal finder that shows its working. 55 deals across 8 categories and 8 stores (Amazon, Walmart, Best Buy, Target, B&H, Newegg, Kohl's, Away), every one read on Fri 27 Nov 2026 from the store named or a deals source that names the store, and stamped with its check time and source on the card itself. Each card shows the product, the store, the sale price, the usual price, the discount those two prices actually imply, and an honest verdict — *New low*, *Strong price*, or *Routine sale* — because a finder that calls everything amazing helps nobody. Five hero products (AirPods Pro 3, MacBook Air M5, Switch 2 bundle, Kindle Paperwhite, LEGO Botanicals Hibiscus) were checked at two stores each and sit in a comparison section that marks the lowest price, or says plainly when the price is a tie. Live search, category chips, store and minimum-discount filters, and four sort orders all run in the browser over the checked dataset; the whole site is static and makes zero network requests.

The site lives in `app/` (hand-written HTML/CSS/JS, no framework, no build step; the deal dataset is `app/data/deals.js`). `screenshots/` holds four real renders of the site — the full shelf, a filtered audio view, the comparison view, and the phone layout — indexed by `shots.json`. `main.ts` is the hand-in program: it copies `app/` and `screenshots/` into the output directory and writes `dossier.json` with the vendored make.fun dossier library (`vendor/makefun-frontend.ts`, byte-unchanged from the kit).

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8137/
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts   # hand-in: copies app/ + screenshots/ and writes dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=vdsf53gd&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>

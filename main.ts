// Cartwise hand-in program (Node 22, standard library only).
//
// The repository holds a finished static site under app/ and its screenshots
// under screenshots/. This program is the courier, not the shop: it carries
// both folders into the output directory untouched, then asks the vendored
// make.fun dossier library to summarise exactly what was carried, and writes
// that summary as dossier.json beside them. The dossier must describe the
// files as they stand, so nothing here edits, minifies or regenerates the
// site — copying is all it does, plus the one library call.
//
// The output directory is /output under the grader and the value of
// MAKEFUN_OUTPUT_DIR anywhere else. It is created if missing and filled, but
// never deleted: the directory itself may be a mount the runner owns.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function carryFolder(name: string): void {
  const from = join(repoDir, name);
  const to = join(outputDir, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true });
  }
}

mkdirSync(outputDir, { recursive: true });
carryFolder('app');
carryFolder('screenshots');

const dossierText = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossierText);

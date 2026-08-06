// Re-downloads the self-hosted Google Fonts woff2 files into src/assets/fonts.
//
// They live under src/ rather than public/ so Vite content-hashes them into
// /assets/, which is the only path the deploy serves with a long immutable
// cache. Files in public/ are served `max-age=0, must-revalidate`.
//
// Run this when the font families/weights in src/styles.css change, or to pick
// up an upstream font revision. Google rotates the hashed gstatic URLs, so we
// always resolve them fresh from the css2 endpoint rather than hardcoding them.
//
//   node scripts/fetch-fonts.mjs
//
// Only the `latin` and `latin-ext` subsets are kept — the site is English-only.
// If you ever add Cyrillic/Greek/Vietnamese copy, add them to SUBSETS and add
// matching @font-face blocks to src/styles.css.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap";

// css2 serves woff2 only to browsers that advertise support.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const SUBSETS = new Set(["latin", "latin-ext"]);
const OUT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

const cssRes = await fetch(CSS_URL, { headers: { "User-Agent": UA } });
if (!cssRes.ok) {
  throw new Error(`Google Fonts CSS request failed: ${cssRes.status} ${cssRes.statusText}`);
}
const css = await cssRes.text();

// Each face is preceded by a `/* subset */` comment identifying its subset.
const faces = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
if (faces.length === 0) {
  throw new Error("No @font-face blocks parsed — the css2 response format may have changed.");
}

// Both families are variable fonts: every weight of a given family+subset points
// at the same file, so dedupe by filename.
const wanted = new Map();
for (const [, subset, block] of faces) {
  if (!SUBSETS.has(subset)) continue;
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const url = block.match(/url\(([^)]+)\)/)?.[1];
  if (!family || !url) continue;
  wanted.set(`${family.toLowerCase()}-${subset}.woff2`, url);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [name, url] of [...wanted].sort()) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Font download failed for ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 4).toString("latin1") !== "wOF2") {
    throw new Error(`${name} is not a woff2 file (bad signature)`);
  }
  await writeFile(path.join(OUT_DIR, name), buf);
  console.log(`${(buf.length / 1024).toFixed(1).padStart(7)} KiB  src/assets/fonts/${name}`);
}

console.log(
  `\nWrote ${wanted.size} font files. Verify the unicode-range values in src/styles.css still match.`,
);

// Adds a content fingerprint (?v=xxxxxxxx) to every CSS/JS link in the HTML
// pages, so browsers load fresh files right after a deploy instead of mixing
// new HTML with cached old CSS.
//
//   node .github/scripts/stamp-assets.mjs          update the pages
//   node .github/scripts/stamp-assets.mjs --check  fail if a page is outdated (CI)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const assets = [
  ...readdirSync('css').filter((f) => f.endsWith('.css')).sort().map((f) => `css/${f}`),
  'js/main.js'
];
const hash = createHash('sha1');
assets.forEach((f) => hash.update(readFileSync(f)));
const version = hash.digest('hex').slice(0, 8);

const pages = readdirSync('.').filter((f) => f.endsWith('.html'));
const pattern = /((?:href|src)="(?:css\/[\w-]+\.css|js\/main\.js))(?:\?v=[0-9a-f]+)?"/g;
const outdated = [];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const stamped = html.replace(pattern, `$1?v=${version}"`);
  if (stamped !== html) {
    outdated.push(page);
    if (!process.argv.includes('--check')) writeFileSync(page, stamped);
  }
}

if (process.argv.includes('--check')) {
  if (outdated.length) {
    console.error(`✖ CSS/JS changed but these pages still point to the old version: ${outdated.join(', ')}`);
    console.error('  Run: node .github/scripts/stamp-assets.mjs   and commit the result.');
    process.exit(1);
  }
  console.log(`✔ All pages reference the current CSS/JS version (${version}).`);
} else {
  console.log(outdated.length ? `Stamped ${outdated.join(', ')} with v=${version}` : `Already current (v=${version})`);
}

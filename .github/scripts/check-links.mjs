// Checks that every local link, image, script, stylesheet and in-page anchor
// in the site's HTML (and url() in CSS) points to something that exists.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((f) => f.endsWith('.html') && f !== '404.html');
const cssFiles = readdirSync(join(root, 'css')).map((f) => join('css', f));
const errors = [];
const idsCache = {};

const ids = (file) => {
  if (!idsCache[file]) {
    const html = readFileSync(join(root, file), 'utf8');
    idsCache[file] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }
  return idsCache[file];
};

const isExternal = (url) => /^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || url.startsWith('//');

for (const file of htmlFiles) {
  const html = readFileSync(join(root, file), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (!url || isExternal(url)) continue;
    const [path, frag] = url.split('#');
    const target = path ? normalize(join(dirname(file), path)) : file;
    if (path && !existsSync(join(root, target))) errors.push(`${file}: ${attr}="${url}" → missing file`);
    else if (frag && target.endsWith('.html') && !ids(target).has(frag)) errors.push(`${file}: ${attr}="${url}" → no id="${frag}"`);
  }
}

for (const file of cssFiles) {
  const css = readFileSync(join(root, file), 'utf8');
  for (const [, url] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (isExternal(url)) continue;
    const target = normalize(join(dirname(file), url.split('#')[0]));
    if (!existsSync(join(root, target))) errors.push(`${file}: url(${url}) → missing file`);
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} broken reference(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`✔ All local links, assets and anchors resolve (${htmlFiles.length} HTML, ${cssFiles.length} CSS files).`);

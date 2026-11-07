// PDF export: "Export this design" (?print=one&only=N, what the per-design button does) fits all four faces on one page.
// Prints cards.html with headless Edge/Chrome, so it needs `npm run build` first (render-cards.sh does it).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const BROWSER = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe']
  .find((p) => fs.existsSync(p));
const SHEET = path.join(__dirname, '../cards.html');
const SETS = fs.readdirSync(path.join(__dirname, '../sets')).filter((f) => /^\d{2}-.+\.html$/.test(f)).length;

function pages(query) {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cn-')), 'p.pdf');
  execFileSync(BROWSER, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=6000',
    '--print-to-pdf=' + out, 'file:///' + SHEET.replace(/\\/g, '/') + '?' + query], { stdio: 'ignore' });
  return (fs.readFileSync(out, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
}

test('exporting one design prints its four faces on a single page', { skip: !BROWSER && 'no Edge/Chrome' }, () => {
  for (const n of [1, 19, SETS]) assert.strictEqual(pages('print=one&only=' + n), 1, 'set ' + n);
});

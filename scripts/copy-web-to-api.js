/*
  Copies Angular build output into api/public
  Works with both Angular "application" builder outputs:
  - web/dist/<name>/ (index.html at root)
  - web/dist/<name>/browser/ (SSR-style browser folder)
*/

const fs = require('fs');
const path = require('path');

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function isFile(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function rmrf(p) {
  if (!exists(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const root = path.resolve(__dirname, '..');
const webDist = path.join(root, 'web', 'dist');
const apiPublic = path.join(root, 'api', 'public');

if (!exists(webDist)) {
  console.error('❌ No existe web/dist. Primero corre: npm --workspace web run build');
  process.exit(1);
}

// Find best candidate dist folder
const distEntries = fs.readdirSync(webDist, { withFileTypes: true }).filter(d => d.isDirectory());
let candidateRoot = null;

// Prefer a folder that contains index.html (root) or browser/index.html
for (const dir of distEntries) {
  const base = path.join(webDist, dir.name);
  const idxRoot = path.join(base, 'index.html');
  const idxBrowser = path.join(base, 'browser', 'index.html');
  if (isFile(idxBrowser)) { candidateRoot = path.join(base, 'browser'); break; }
  if (isFile(idxRoot)) { candidateRoot = base; break; }
}

// If not found, try common fallback
if (!candidateRoot && distEntries.length === 1) {
  const base = path.join(webDist, distEntries[0].name);
  const idxBrowser = path.join(base, 'browser', 'index.html');
  candidateRoot = isFile(idxBrowser) ? path.join(base, 'browser') : base;
}

if (!candidateRoot || !exists(candidateRoot)) {
  console.error('❌ No pude detectar la carpeta final de Angular. Revisa web/dist.');
  process.exit(1);
}

rmrf(apiPublic);
copyDir(candidateRoot, apiPublic);

console.log('✅ Frontend copiado a api/public desde:', path.relative(root, candidateRoot));

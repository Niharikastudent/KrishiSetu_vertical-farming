const fs = require('fs');
const path = require('path');

const defaultDir = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, '..', 'data');
const DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : defaultDir;
fs.mkdirSync(DIR, { recursive: true });

// Seed sample json files to writable DIR if running in a serverless environment
const seedDir = path.join(__dirname, '..', 'data');
if (DIR !== seedDir && fs.existsSync(seedDir)) {
  try {
    for (const f of fs.readdirSync(seedDir)) {
      const src = path.join(seedDir, f);
      const dst = path.join(DIR, f);
      if (fs.statSync(src).isFile()) {
        if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > (fs.existsSync(dst) ? fs.statSync(dst).mtimeMs : 0)) {
          fs.copyFileSync(src, dst);
        }
      }
    }
  } catch (e) {}
}

const cache = {};

/** Tiny JSON-file collection store. `rows` is a live array; call save() after mutating. */
function col(name) {
  const file = path.join(DIR, name + '.json');
  if (!cache[name]) cache[name] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8') || '[]') : [];
  return {
    rows: cache[name],
    save() {
      const tmp = file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(cache[name], null, 2));
      fs.renameSync(tmp, file);
    },
  };
}

module.exports = { col, DIR };

const fs = require('fs');
const path = require('path');

const DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, '..', 'data');
fs.mkdirSync(DIR, { recursive: true });
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

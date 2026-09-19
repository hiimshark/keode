// Gỡ khối admin CŨ (bị nuốt $$), giữ khối MỚI (đã sửa $$).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const MARK = '/* ================= ADMIN PANEL ================= */';
const first = h.indexOf(MARK);
const second = h.indexOf(MARK, first + 1);
if (second < 0) { console.log('chỉ có 1 khối — không cần gỡ'); process.exit(0); }
const good = h.indexOf("$$('#atabs .tab')");          // khối MỚI có $$
const bad = h.indexOf("$('#atabs .tab')forEach") !== -1 ? h.indexOf("$('#atabs .tab')") : h.indexOf("$('#atabs .tab')");
console.log('old block:', bad > -1 && bad < second ? 'trước' : '?', '| new block $$ tại:', good);
// Cũ = khối KHÔNG chứa $$('#atabs
if (first < second) {
  // xác định khối nào là mới: khối chứa "$$('#atabs"
  const firstIsNew = h.slice(first, h.indexOf('/* ================= ROUTING ================= */', first)).includes("$$('#atabs");
  if (firstIsNew) {
    // xoá khối thứ hai
    const r2 = h.indexOf('/* ================= ROUTING ================= */', second);
    h = h.slice(0, second) + h.slice(r2);
  } else {
    // xoá khối thứ nhất (cũ) + ROUTING của nó
    const r1 = h.indexOf('/* ================= ROUTING ================= */', first);
    h = h.slice(0, first) + h.slice(r1);
  }
}
fs.writeFileSync('keo-de.html', h);
console.log('done. Kích thước:', (h.length / 1024).toFixed(1) + 'KB', '| $$atabs:', h.includes("$$('#atabs"), '| single:', /[^$]\$\('#atabs \.tab'\)/.test(h));

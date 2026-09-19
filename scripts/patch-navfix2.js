// Sửa hậu quả patch trước: gỡ header applyRoute cũ trùng lặp, gộp vào applyRouteNow.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `function applyRouteNow(h){
function applyRoute(){
  const h=(location.hash||'#discover').slice(1);
  const loginEl=`;
const b = `function applyRouteNow(h){
  const loginEl=`;
if (!h.includes(a)) { console.log('anchor not found — kiểm tra'); process.exit(1); }
h = h.replace(a, b);
fs.writeFileSync('keo-de.html', h);
console.log('applyRouteNow merged OK');

// Gỡ khối admin bị chèn trùng (giữ bản đầu, xoá bản thứ hai đến trước ROUTING).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const MARK = '/* ================= ADMIN PANEL ================= */';
const first = h.indexOf(MARK);
const second = h.indexOf(MARK, first + 1);
if (second < 0) { console.log('không có trùng lặp'); process.exit(0); }
const routingAfter = h.indexOf('/* ================= ROUTING ================= */', second);
if (routingAfter < 0) { console.log('không tìm thấy ROUTING sau khối thứ hai'); process.exit(1); }
h = h.slice(0, second) + h.slice(routingAfter);
fs.writeFileSync('keo-de.html', h);
console.log('đã gỡ khối trùng. Kích thước mới:', (h.length / 1024).toFixed(1) + 'KB');

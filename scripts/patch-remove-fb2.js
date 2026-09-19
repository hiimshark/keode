// Gỡ nốt dòng handler FB còn sót (nút đã bị xoá → $ null sẽ văng lỗi).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = "$('#fbBtn').addEventListener('click',loginFacebook);\n";
if (!h.includes(a)) { console.log('not found'); process.exit(1); }
h = h.replace(a, '');
fs.writeFileSync('keo-de.html', h);
console.log('handler removed');

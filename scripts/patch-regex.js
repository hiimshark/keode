// Fix parseSnippet: bỏ escape quote dễ sai bằng cách nối chuỗi.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `  const g=k=>{const m=t.match(new RegExp(k+'\\\\s*[:=]\\\\s*["\\']([^"\\\\']+)["\\']'));return m?m[1]:'';};`;
const b = `  const q='"' + "'";
  const g=k=>{const m=t.match(new RegExp(k+'\\\\s*[:=]\\\\s*['+q+']([^'+q+']+)['+q+']'));return m?m[1]:'';};`;
if (!h.includes(a)) { console.log('regex line not found'); process.exit(1); }
h = h.replace(a, b);
fs.writeFileSync('keo-de.html', h);
console.log('parseSnippet fixed');

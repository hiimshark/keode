// v0.9.2 — nạp auth-config.js + file mẫu + ẩn khung cấu hình khi đã có config.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. Nạp auth-config.js trước script chính */
rep(`<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">`,
`<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="auth-config.js"></script>`, 'auth-config script tag');

/* 2. ẩn nút cấu hình khi đã có config (status ✓) */
rep(`  if(fbValid(FB))\$('#cfgPanel').classList.add('hide');`,
`  if(fbValid(FB)){\$('#cfgPanel').classList.add('hide');\$('#cfgToggle').classList.add('hide');}`, 'hide cfgToggle');

/* 3. status ghi rõ hơn */
rep(`  if(st)st.innerHTML=fbValid(FB)`,
`  if(st)st.innerHTML=fbValid(FB)`, 'noop keep');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch OK');
process.exit(missing.length ? 1 : 0);

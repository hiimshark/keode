// Sửa dòng bị hỏng bởi lệnh inline: $.forEach → $$('#atabs .tab').forEach
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const D = '$';
const broken = '  ' + D + ".forEach(t=>t.classList.toggle('on',t.dataset.at===aTab));";
const ok = '  ' + D + D + "('#atabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.at===aTab));";
if (h.includes(broken)) {
  h = h.replace(broken, () => ok);
  fs.writeFileSync('keo-de.html', h);
  console.log('atabs line rebuilt OK');
} else if (h.includes(ok)) { console.log('already ok'); }
else { console.log('CORRUPT LINE NOT FOUND — xem tay:'); process.exit(1); }

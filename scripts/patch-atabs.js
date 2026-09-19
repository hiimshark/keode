// Fix dòng bị nuốt $$ trong khối admin còn sót lại.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const broken = "$('#atabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.at===aTab));";
const ok = "$$('#atabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.at===aTab));";
if (h.includes(broken) && !h.includes(ok)) {
  h = h.replace(broken, () => ok);
  fs.writeFileSync('keo-de.html', h);
  console.log('atabs $$ fixed');
} else if (h.includes(ok)) { console.log('already ok'); }
else { console.log('NOT FOUND — tìm tay'); process.exit(1); }

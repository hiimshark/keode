// Ẩn link "Xem thử demo" khi đăng nhập thật đã bật.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `  if(fbValid(FB)){$('#cfgPanel').classList.add('hide');$('#cfgToggle').classList.add('hide');}`;
const b = `  if(fbValid(FB)){$('#cfgPanel').classList.add('hide');$('#cfgToggle').classList.add('hide');$('#demoLink').classList.add('hide');}`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('demo link hidden when configured');

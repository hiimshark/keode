// Vá: lưu kèo từ admin panel → ở lại panel (không nhảy về Khám phá).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `  f.reset();prefillPartner=null;editingKeoId=null;$('#partnerHint').classList.add('hide');
  closeModal();
  route('discover');`;
const b = `  f.reset();prefillPartner=null;editingKeoId=null;$('#partnerHint').classList.add('hide');
  closeModal();
  if(!$('#view-admin').classList.contains('hide')){renderAdminBody();route('admin');}
  else route('discover');`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, b);
fs.writeFileSync('keo-de.html', h);
console.log('submit admin-aware OK');

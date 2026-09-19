// Áp nốt: veForm cloud-first (anchor khớp file thật).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `  if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
  else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
  savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
  toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');`;
const b = `  if(MODE==='cloud'&&db){
    if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
  }else{
    if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
    else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
    savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
    toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
  }`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('veForm cloud OK');

// Fix: #veForm nằm ngoài #adminBody → tách listener submit riêng.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `$('#adminBody').addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='passForm'){
    if(hashStr($('#pCur').value)!==adminPass){toast('Mật khẩu hiện tại không đúng.');return;}
    if($('#pNew').value.length<6){toast('Mật khẩu mới tối thiểu 6 ký tự.');return;}
    adminPass=hashStr($('#pNew').value);save('keode.adminpass.v1',adminPass);
    e.target.reset();toast('Đã đổi mật khẩu quản trị ✓');
  }
  if(e.target.id==='veForm'){
    const data={name:$('#vEname').value.trim(),district:$('#vEdistrict').value,emoji:$('#vEemoji').value,
      tags:$('#vEtags').value.split(',').map(x=>x.trim()).filter(Boolean),promo:$('#vEpromo').value.trim(),note:$('#vEnote').value.trim()};
    if(!data.name)return;
    if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
    else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
    savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
    toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
  }
});`;
const b = `$('#adminBody').addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='passForm'){
    if(hashStr($('#pCur').value)!==adminPass){toast('Mật khẩu hiện tại không đúng.');return;}
    if($('#pNew').value.length<6){toast('Mật khẩu mới tối thiểu 6 ký tự.');return;}
    adminPass=hashStr($('#pNew').value);save('keode.adminpass.v1',adminPass);
    e.target.reset();toast('Đã đổi mật khẩu quản trị ✓');
  }
});
$('#veForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data={name:$('#vEname').value.trim(),district:$('#vEdistrict').value,emoji:$('#vEemoji').value,
    tags:$('#vEtags').value.split(',').map(x=>x.trim()).filter(Boolean),promo:$('#vEpromo').value.trim(),note:$('#vEnote').value.trim()};
  if(!data.name){toast('Điền tên quán nhé.');return;}
  if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
  else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
  savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
  toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
});`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('veForm listener fixed');

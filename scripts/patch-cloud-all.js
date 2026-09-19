// v0.9.4 — HẾT DEMO: mọi thứ lên cloud. Quán đối tác lưu Firestore. Tự migrate kèo/quán cũ trên máy lên cloud.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. initCloud: thêm venues onSnapshot + seed/migrate */
rep(`    db.collection('verifications').onSnapshot(s=>{CLOUD_VERIFIED={};s.forEach(d=>{CLOUD_VERIFIED[d.id]=d.data()||{};});if(MODE==='cloud')renderAll();});`,
`    db.collection('verifications').onSnapshot(s=>{CLOUD_VERIFIED={};s.forEach(d=>{CLOUD_VERIFIED[d.id]=d.data()||{};});if(MODE==='cloud')renderAll();});
    db.collection('venues').onSnapshot(s=>{
      if(!s.empty){
        PARTNERS=s.docs.map(d=>Object.assign({id:d.id},d.data()));
        renderPartnerStrip();renderVenues();
      }else if(!venueSeeded){
        venueSeeded=true;
        /* lần đầu: đẩy quán mẫu + quán đã tạo trên máy lên cloud (chỉ admin thành công) */
        PARTNERS.forEach(p=>{const{id,...data}=p;db.collection('venues').doc(String(p.id)).set(data).catch(()=>{});});
      }
    },()=>{});`, 'venues snapshot');

/* 2. biến phụ trợ */
rep(`let MODE='local',CLOUD_KEO=[],db=null,cloudConnecting=false,confirmResult=null;`,
`let MODE='local',CLOUD_KEO=[],db=null,cloudConnecting=false,confirmResult=null,venueSeeded=false;`, 'venueSeeded var');

/* 3. startSession: LUÔN lên cloud khi có config (hết phân biệt demo) */
rep(`  if(s.provider!=='demo'&&fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}`,
`  if(fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}`, 'startSession always cloud');

/* 4. sau khi cloud sẵn sàng: migrate kèo + quán cũ trên máy lên cloud (1 lần) */
rep(`      CLOUD_KEO=snap.docs.map(d=>Object.assign({id:d.id},d.data()));
      cloudConnecting=false;
      if(MODE!=='cloud'){MODE='cloud';toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
      renderAll();updateModeBadge();`,
`      CLOUD_KEO=snap.docs.map(d=>Object.assign({id:d.id},d.data()));
      cloudConnecting=false;
      const wasLocal=MODE!=='cloud';
      if(wasLocal){MODE='cloud';toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
      /* migrate: kèo/quán đã tạo lúc local (trước khi có cloud) đẩy lên cloud 1 lần */
      if(KEO.length&&session&&session.id){
        const ids=new Set(CLOUD_KEO.map(x=>String(x.id)));
        KEO.forEach(p=>{if(!ids.has(String(p.id))){const{ id,...data }=p;db.collection('keos').doc(String(p.id)).set(Object.assign({},data,{hostUid:session.id})).catch(()=>{});}});
        KEO=[];save('keode.posts.v2',KEO);
      }`, 'migrate kèo');

/* 5. Admin venue form: cloud-first */
rep(`    if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
    else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
    savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
    toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');`,
`    if(MODE==='cloud'&&db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{
      if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
      else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
      savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
      toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
    }`, 'venue form cloud');

/* 6. Admin venue delete: cloud-first */
rep(`  else if(act==='vdel'){if(confirm('Xoá quán đối tác này?')){PARTNERS=PARTNERS.filter(x=>x.id!==id);savePartners();renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}}`,
`  else if(act==='vdel'){if(!confirm('Xoá quán đối tác này?'))return;
    if(MODE==='cloud'&&db){db.collection('venues').doc(String(id)).delete().then(()=>{renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}).catch(err=>toast('Lỗi cloud: '+err.code));}
    else{PARTNERS=PARTNERS.filter(x=>x.id!==id);savePartners();renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}}`, 'venue delete cloud');

/* 7. version */
rep(`KÈO ĐÊ — v0.9 "EMAIL ACCOUNTS + KYC CCCD"`, `KÈO ĐÊ — v0.9.4 "CLOUD-ONLY"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch cloud-all OK');
process.exit(missing.length ? 1 : 0);

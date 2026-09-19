// Gates cuối: kyc approve, venue form, kform submit — anchor khớp chính xác.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. KYC approve (admin) */
rep(`    if(MODE==='cloud'&&db){
      Promise.all([
        db.collection('verifications').doc(String(id)).set({at:Date.now(),by:'admin'}),
        db.collection('kyc').doc(String(id)).delete()
      ]).then(()=>{renderAdminBody();toast('✓ Đã gắn thẻ xác minh.');}).catch(err=>toast('Lỗi cloud: '+err.message));
    }else{
      VERIFIED_L[id]={at:Date.now(),by:'admin'};saveVerified();
      KYC=KYC.filter(x=>String(x.uid)!==String(id));saveKYC();
      renderAdminBody();renderFeed();toast('✓ Đã gắn thẻ xác minh.');
    }`,
`    if(db){
      Promise.all([
        db.collection('verifications').doc(String(id)).set({at:Date.now(),by:'admin'}),
        db.collection('kyc').doc(String(id)).delete()
      ]).then(()=>{renderAdminBody();toast('✓ Đã gắn thẻ xác minh.');}).catch(err=>toast('Lỗi cloud: '+err.message));
    }else if(!fbValid(FB)){
      VERIFIED_L[id]={at:Date.now(),by:'admin'};saveVerified();
      KYC=KYC.filter(x=>String(x.uid)!==String(id));saveKYC();
      renderAdminBody();renderFeed();toast('✓ Đã gắn thẻ xác minh.');
    }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');}`, 'kyc approve gate');

/* 2. venue form */
rep(`    if(MODE==='cloud'&&db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{
      if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
      else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
      savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
      toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
    }`,
`    if(db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else if(!fbValid(FB)){
      if(editingVenueId){const i=PARTNERS.findIndex(x=>x.id===editingVenueId);if(i>=0)PARTNERS[i]=Object.assign({},PARTNERS[i],data);}
      else PARTNERS.unshift(Object.assign({id:'p'+Date.now()},data));
      savePartners();closeVenueModal();renderAdminBody();renderPartnerStrip();renderVenues();
      toast(editingVenueId?'Đã cập nhật quán.':'Đã thêm quán đối tác ✓');
    }else{toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');}`, 'venue form gate');

/* 3. kform submit: edit + create */
rep(`  if(editingKeoId){
    if(MODE==='cloud'&&db){
      try{await db.collection('keos').doc(String(editingKeoId)).update(Object.assign({updatedAt:Date.now()},base));}
      catch(err){toast('Firebase chặn sửa kèo người khác ở bản mẫu — cần quyền admin trên server (custom claim). Đã ghi nhận.');return;}
      toast('Đã cập nhật kèo (cloud).');
    }else{
      const i=KEO.findIndex(x=>String(x.id)===String(editingKeoId));
      if(i>=0)KEO[i]=Object.assign({},KEO[i],base,{expiresAt});
      save('keode.posts.v2',KEO);renderAll();
      toast('Đã cập nhật kèo.');
    }
  }else if((MODE==='cloud'||(session&&session.provider!=='demo'))&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    toast('☁️ Đã đăng kèo lên Cloud! Điện thoại và máy khác đều thấy.');
  }else{
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }`,
`  if(editingKeoId){
    if(db){
      try{await db.collection('keos').doc(String(editingKeoId)).update(Object.assign({updatedAt:Date.now()},base));}
      catch(err){toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin trong trình duyệt này. ('+err.code+')');return;}
      toast('Đã cập nhật kèo (cloud).');
    }else if(!fbValid(FB)){
      const i=KEO.findIndex(x=>String(x.id)===String(editingKeoId));
      if(i>=0)KEO[i]=Object.assign({},KEO[i],base,{expiresAt});
      save('keode.posts.v2',KEO);renderAll();
      toast('Đã cập nhật kèo.');
    }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}
  }else if(db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    toast('☁️ Đã đăng kèo lên Cloud! Điện thoại và máy khác đều thấy.');
  }else if(!fbValid(FB)){
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }else{
    toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;
  }`, 'kform gate');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'final gates OK');
process.exit(missing.length ? 1 : 0);

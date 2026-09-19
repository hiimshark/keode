// Áp nốt 6 gate còn lại — anchor khớp file thật.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. toggleJoin: huỷ */
rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined.splice(i,1);save('keode.posts.v2',KEO);}
    toast('Đã huỷ yêu cầu tham gia.');`,
`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}
      else if(!fbValid(FB)){p.joined.splice(i,1);save('keode.posts.v2',KEO);}
      else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}
    }
    toast('Đã huỷ yêu cầu tham gia.');`, 'cancel gate');

/* 2. toggleJoin: tham gia */
rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined.push(member);save('keode.posts.v2',KEO);}
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');`,
`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];}
      else if(!fbValid(FB)){p.joined.push(member);save('keode.posts.v2',KEO);}
      else{toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;}
    }
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');`, 'join gate');

/* 3. deleteKeo */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();
  }
  toast('Đã xoá kèo.');`,
`  if(db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else if(!fbValid(FB)){
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();
  }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}
  toast('Đã xoá kèo.');`, 'deleteKeo gate');

/* 4. kform submit (edit + create) */
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
      catch(err){toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');return;}
      toast('Đã cập nhật kèo (cloud).');
    }else{
      const i=KEO.findIndex(x=>String(x.id)===String(editingKeoId));
      if(i>=0)KEO[i]=Object.assign({},KEO[i],base,{expiresAt});
      save('keode.posts.v2',KEO);renderAll();
      toast('Đã cập nhật kèo.');
    }
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

/* 5. venue form */
rep(`    if(MODE==='cloud'&&db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{`,
`    if(db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{`, 'venue form gate');

/* 6. admin clear all */
rep(`    if(MODE==='cloud'&&db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));toast('Đang xoá trên cloud…');}`,
`    if(db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));toast('Đang xoá trên cloud…');}`, 'admin clear');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'gates OK');
process.exit(missing.length ? 1 : 0);

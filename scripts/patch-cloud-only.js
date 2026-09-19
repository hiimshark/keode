// v0.9.9 — CLOUD-ONLY: bỏ chế độ Local/Demo trên live. Không kết nối = báo lỗi + thử lại, không bao giờ im lặng lưu máy.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. updateModeBadge: 4 trạng thái — connecting / cloud / error(retry) / dev */
rep(`function updateModeBadge(){
  const b=\$('#modeBadge');if(!b)return;
  if(cloudConnecting){b.textContent='☁️ Đang kết nối cloud…';b.className='mbadge mcon';}
  else if(MODE==='cloud'){b.textContent='☁️ Cloud — mọi người cùng thấy kèo';b.className='mbadge mcld';}
  else{b.textContent='💾 Demo — kèo chỉ lưu trên máy này';b.className='mbadge mloc';}
}`,
`function updateModeBadge(){
  const b=\$('#modeBadge');if(!b)return;
  b.onclick=null;b.style.cursor='';
  if(cloudConnecting){b.textContent='⏳ Đang kết nối cloud…';b.className='mbadge mcon';}
  else if(MODE==='cloud'){b.textContent='☁️ Cloud — kèo đồng bộ mọi thiết bị';b.className='mbadge mcld';}
  else if(MODE==='error'){b.textContent='⚠️ Mất kết nối — bấm thử lại';b.className='mbadge mloc';b.style.cursor='pointer';b.onclick=()=>location.reload();}
  else{b.textContent='🧪 Dev — dữ liệu máy này';b.className='mbadge mloc';}
}`, 'badge v2');

/* 2. allKeo: cloud → cloud; dev (không config) → máy; lỗi kết nối → rỗng (thật thà) */
rep(`function allKeo(){return MODE==='cloud'?CLOUD_KEO:KEO;}`,
`function allKeo(){return MODE==='cloud'?CLOUD_KEO:(fbValid(FB)?[]:KEO);}`, 'allKeo');

/* 3. lỗi kết nối: MODE='error' thay 'local' */
rep(`    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});`,
`    },err=>{cloudConnecting=false;MODE='error';updateModeBadge();toast('⚠️ Không kết nối được cloud — bấm biểu tượng trạng thái để thử lại.');});`, 'err snapshot');
rep(`  }catch(e){cloudConnecting=false;MODE='local';updateModeBadge();toast('Không kết nối được cloud — đang dùng chế độ máy bạn.');}`,
`  }catch(e){cloudConnecting=false;MODE='error';updateModeBadge();toast('⚠️ Không kết nối được cloud — bấm biểu tượng trạng thái để thử lại.');}`, 'err catch');

/* 4. kform submit: gate — cloud → cloud; dev → local; live chưa nối → chặn lịch sự */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }else{
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }`,
`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }else if(!fbValid(FB)){
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
    toast('Đăng kèo thành công! (dev — dữ liệu máy này)');
  }else{
    toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;
  }`, 'kform gate');

/* 5. toggleJoin join + cancel */
rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];renderFeed();renderMine();}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined.push(member);save('keode.posts.v2',KEO);renderFeed();renderMine();}
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');`,
`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];renderFeed();renderMine();}
      else if(!fbValid(FB)){p.joined.push(member);save('keode.posts.v2',KEO);renderFeed();renderMine();}
      else{toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;}
      toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');}`, 'join gate');

rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined=p.joined.filter((_,idx)=>idx!==i);save('keode.posts.v2',KEO);}`,
`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}
      else if(!fbValid(FB)){p.joined=p.joined.filter((_,idx)=>idx!==i);save('keode.posts.v2',KEO);}
      else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}}`, 'cancel gate');

/* 6. deleteKeo */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    renderFeed();
  }else{
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();
  }`,
`  if(db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    renderFeed();
  }else if(!fbValid(FB)){
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();
  }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}`, 'deleteKeo gate');

/* 7. adminDeleteKeo */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud (cần quyền admin server): '+err.message);return;}
    renderAdminBody();renderFeed();
  }else{
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();renderAdminBody();
  }`,
`  if(db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    renderAdminBody();renderFeed();
  }else if(!fbValid(FB)){
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();renderAdminBody();
  }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}`, 'adminDeleteKeo gate');

/* 8. resetKeo */
rep(`  if(MODE==='cloud'&&db){
    const mine=CLOUD_KEO.filter(p=>p.joined[0]&&p.joined[0].uid===session.id);
    Promise.all(mine.map(p=>db.collection('keos').doc(String(p.id)).delete()))
      .then(()=>toast('Đã xoá các kèo của bạn khỏi cloud.'))
      .catch(err=>toast('Lỗi cloud: '+err.message));
  }else{
    KEO=[];save('keode.posts.v2',KEO);closeRadarPop();renderAll();
    toast('Đã xoá hết kèo — bảng tin đang trống.');
  }`,
`  if(db){
    const mine=CLOUD_KEO.filter(p=>p.joined[0]&&p.joined[0].uid===session.id);
    Promise.all(mine.map(p=>db.collection('keos').doc(String(p.id)).delete()))
      .then(()=>{renderAll();toast('Đã xoá các kèo của bạn khỏi cloud.');})
      .catch(err=>toast('Lỗi cloud: '+err.message));
  }else if(!fbValid(FB)){
    KEO=[];save('keode.posts.v2',KEO);closeRadarPop();renderAll();
    toast('Đã xoá hết kèo — bảng tin đang trống.');
  }else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');}`, 'resetKeo gate');

/* 9. admin clear all */
rep(`    if(MODE==='cloud'&&db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));toast('Đang xoá trên cloud…');}`,
`    if(db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));toast('Đang xoá trên cloud…');}`, 'clear all gate');

/* 10. venue form gate */
rep(`    if(MODE==='cloud'&&db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{`,
`    if(db){
      if(editingVenueId){db.collection('venues').doc(String(editingVenueId)).update(data).then(()=>{closeVenueModal();toast('Đã cập nhật quán (cloud).');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
      else{db.collection('venues').doc('p'+Date.now()).set(data).then(()=>{closeVenueModal();toast('Đã thêm quán đối tác lên cloud ✓');}).catch(err=>{toast('Lỗi cloud: cần đăng nhập Google bằng tài khoản admin. ('+err.code+')');});}
    }else{`, 'venue form gate');

/* 11. venue delete gate */
rep(`    if(MODE==='cloud'&&db){db.collection('venues').doc(String(id)).delete().then(()=>{renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}).catch(err=>toast('Lỗi cloud: '+err.code));}`,
`    if(db){db.collection('venues').doc(String(id)).delete().then(()=>{renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}).catch(err=>toast('Lỗi cloud: '+err.code));}`, 'venue delete gate');

/* 12. kyc gates */
rep(`    if(MODE==='cloud'&&db){db.collection('kyc').doc(String(id)).delete().catch(()=>{});}`,
`    if(db){db.collection('kyc').doc(String(id)).delete().catch(()=>{});}`, 'kyc delete gate');
rep(`  if(MODE==='cloud'&&db){db.collection('kyc').doc(session.id).delete().catch(()=>{});}`,
`  if(db){db.collection('kyc').doc(session.id).delete().catch(()=>{});}`, 'kyc withdraw gate');
rep(`  if(MODE==='cloud'&&db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));}`,
`  if(db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));}`, 'admin keo clear');

/* 13. submit kyc gate */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('kyc').doc(session.id).set(data);}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{`,
`  if(db){
    try{await db.collection('kyc').doc(session.id).set(data);}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{`, 'kyc submit gate');

/* 14. verifiedOf / myVerify: cloud ưu tiên; dev dùng local */
rep(`function verifiedOf(uid){const m=(MODE==='cloud')?CLOUD_VERIFIED:VERIFIED_L;return !!m[uid];}`,
`function verifiedOf(uid){const m=db?CLOUD_VERIFIED:VERIFIED_L;return !!m[uid];}`, 'verifiedOf');
rep(`  const q=(MODE==='cloud')?KYC_C:KYC;`,
`  const q=db?KYC_C:KYC;`, 'myVerify');
rep(`    const v=(MODE==='cloud')?CLOUD_VERIFIED[session.id]:VERIFIED_L[session.id];`,
`    const v=db?CLOUD_VERIFIED[session.id]:VERIFIED_L[session.id];`, 'detail verified');

/* 15. admin total quan badge text */
rep(`      <div class="ctl"><span class="mbadge \${MODE==='cloud'?'mcld':'mloc'}" style="cursor:default">\${MODE==='cloud'?'☁️ Cloud':'💾 Local'}\${cloudConnecting?' — đang kết nối…':''}</span></div></div>`,
`      <div class="ctl"><span class="mbadge \${MODE==='cloud'?'mcld':'mloc'}" style="cursor:default">\${MODE==='cloud'?'☁️ Cloud':(MODE==='error'?'⚠️ Mất kết nối':'⏳ Đang kết nối…')}</span></div></div>`, 'admin badge');

/* 16. version */
rep(`KÈO ĐÊ — v0.9.6 "MOBILE POLISH"`, `KÈO ĐÊ — v0.9.9 "CLOUD-ONLY"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch cloud-only OK');
process.exit(missing.length ? 1 : 0);

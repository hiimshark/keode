// v0.7 patch C: toàn bộ JS — policy, cloud Firestore, phone OTP, xoá kèo, tự ẩn, kèo khuya, bảo mật uid.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, b);
}
function repAll(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.split(a).join(b);
}

/* ---- 1. State: cloud mode + admin + helpers ---- */
rep(`let FB=window.KEO_FIREBASE_CONFIG||load('keode.firebase.v1',null);
let session=load('keode.session.v1',null);`,
`let FB=window.KEO_FIREBASE_CONFIG||load('keode.firebase.v1',null);
let session=load('keode.session.v1',null);
let MODE='local',CLOUD_KEO=[],db=null,cloudConnecting=false,confirmResult=null;
const ADMIN_NAMES=['Lê Hoàng Vũ']; // production: dùng custom claim admin trên Firebase, không so tên
function isAdmin(){return !!(profile&&ADMIN_NAMES.includes(profile.name));}
function allKeo(){return MODE==='cloud'?CLOUD_KEO:KEO;}
function isHostOf(p){return !!(session&&p.joined[0]&&p.joined[0].uid===session.id);}
function isExpired(p){return !!(p.expiresAt&&Date.now()>p.expiresAt);}
function isLate(p){if(!p.time)return false;const hh=+p.time.split(':')[0];return hh>=22||hh<4;}
function updateModeBadge(){
  const b=$('#modeBadge');if(!b)return;
  if(cloudConnecting){b.textContent='☁️ Đang kết nối cloud…';b.className='mbadge mcon';}
  else if(MODE==='cloud'){b.textContent='☁️ Cloud — mọi người cùng thấy kèo';b.className='mbadge mcld';}
  else{b.textContent='💾 Demo — kèo chỉ lưu trên máy này';b.className='mbadge mloc';}
}`, 'state');

/* ---- 2. Đếm/radar/feed dùng allKeo + loại kèo hết hạn ---- */
rep(`const districtCount=name=>KEO.filter(p=>p.district===name).length;`,
`const districtCount=name=>allKeo().filter(p=>p.district===name&&!isExpired(p)).length;`, 'districtCount');

rep(`  return sortKeo(KEO.filter(p=>
    (filterState.cat==='all'||p.cat===filterState.cat)&&
    (!filterState.district||p.district===filterState.district)&&
    (!q||(p.title+' '+p.place).toLowerCase().includes(q))));`,
`  return sortKeo(allKeo().filter(p=>
    (filterState.cat==='all'||p.cat===filterState.cat)&&
    (!filterState.district||p.district===filterState.district)&&
    (!q||(p.title+' '+p.place).toLowerCase().includes(q))&&
    !isExpired(p)));`, 'visibleKeo');

/* ---- 3. cardHTML: uid + chip kèo khuya + chip đã ẩn ---- */
rep(`  const isMine=profile&&p.joined[0]&&p.joined[0].name===profile.name;
  const iJoined=profile&&p.joined.some(m=>m.name===profile.name);`,
`  const isMine=isHostOf(p);
  const iJoined=!!(session&&p.joined.some(m=>m.uid===session.id));`, 'cardHTML isMine');

rep(`    partner?\`<span class="ctag a">QUÁN ĐỐI TÁC</span>\`:'',
    w.past?\`<span class="ctag">Đã diễn ra</span>\`:w.ongoing?\`<span class="ctag g">Đang diễn ra</span>\`:remain<=0?\`<span class="ctag p">Hết chỗ</span>\`:\`<span class="ctag p">Còn \${remain} chỗ</span>\``,
`    partner?\`<span class="ctag a">QUÁN ĐỐI TÁC</span>\`:'',
    isExpired(p)?\`<span class="ctag" style="background:#6A7190">Đã ẩn (hết hạn)</span>\`:'',
    isLate(p)&&!w.past?\`<span class="ctag r">🌙 Kèo khuya</span>\`:'',
    w.past?\`<span class="ctag">Đã diễn ra</span>\`:w.ongoing?\`<span class="ctag g">Đang diễn ra</span>\`:remain<=0?\`<span class="ctag p">Hết chỗ</span>\`:\`<span class="ctag p">Còn \${remain} chỗ</span>\``, 'cardHTML chips');

/* ---- 4. detailHTML: uid + cảnh báo khuya + hết hạn + nút xoá ---- */
rep(`  const iJoined=profile&&p.joined.some(m=>m.name===profile.name);
  const isHost=profile&&p.joined[0]&&p.joined[0].name===profile.name;
  const hostKeo=KEO.filter(x=>x.joined[0]&&x.joined[0].name===p.joined[0].name).length;`,
`  const iJoined=!!(session&&p.joined.some(m=>m.uid===session.id));
  const isHost=isHostOf(p);
  const hostKeo=allKeo().filter(x=>x.joined[0]&&x.joined[0].uid===p.joined[0].uid).length;`, 'detailHTML uid');

rep(`  <div class="dgrid">`,
`  \${isLate(p)?\`<div class="latewarn">🌙 KÈO ĐI KHUYA (sau 22h) — hãy đi cùng nhau, chia sẻ vị trí cho người thân và ưu tiên xe riêng. Cẩn thận để bảo vệ các bạn nữ nhé!</div>\`:''}
  \${isExpired(p)?\`<div class="latewarn" style="background:var(--line);border-color:var(--line2);color:var(--mut)">⏰ Kèo đã tự ẩn khỏi bảng tin (hết hạn hiển thị theo cài đặt của chủ kèo).</div>\`:''}
  <div class="dgrid">`, 'detail warns');

rep(`  <div class="stickybar">
    <button class="btn" type="button" id="shareBtn">Chia sẻ kèo</button>`,
`  <div class="stickybar">
    \${(isHost||isAdmin())?'<button class="btn" type="button" id="delBtn" style="color:var(--pink)">Xoá kèo</button>':''}
    <button class="btn" type="button" id="shareBtn">Chia sẻ kèo</button>`, 'sticky del');

/* ---- 5. openDetail + id dạng chuỗi ---- */
rep(`function openDetail(id){
  const p=KEO.find(x=>x.id===id);
  if(!p){route('discover');return;}`,
`function openDetail(id){
  const p=allKeo().find(x=>String(x.id)===String(id));
  if(!p){route('discover');return;}`, 'openDetail');

repAll(`openDetail(+view.dataset.id)`, `openDetail(view.dataset.id)`, 'openDetail view');
repAll(`openDetail(+c.dataset.id)`, `openDetail(c.dataset.id)`, 'openDetail mine');
repAll(`openDetail(+it.dataset.go)`, `openDetail(it.dataset.go)`, 'openDetail pop');
rep(`const id=+h.split('/')[1];
  const p=KEO.find(x=>x.id===id);`,
`const id=h.slice(4);
  const p=allKeo().find(x=>String(x.id)===id);`, 'applyRouteDetail id');

/* ---- 6. toggleJoin: cloud + uid ---- */
rep(`function toggleJoin(id){
  const p=KEO.find(x=>x.id===id);if(!p||!profile)return;
  const i=p.joined.findIndex(m=>m.name===profile.name);
  if(i>0){p.joined.splice(i,1);save('keode.posts.v2',KEO);toast('Đã huỷ yêu cầu tham gia.');}
  else if(i===0){toast('Bạn là chủ kèo này mà!');return;}
  else{
    if(p.joined.length>=p.total){toast('Kèo đã đủ người rồi — hẹn kèo khác nhé!');return;}
    p.joined.push({name:profile.name,color:profile.color,picture:profile.picture||'',rating:'0.0'});save('keode.posts.v2',KEO);
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');
  }
  openDetail(id);renderFeed();
}`,
`async function toggleJoin(id){
  const p=allKeo().find(x=>String(x.id)===String(id));if(!p||!profile)return;
  const i=p.joined.findIndex(m=>m.uid===session.id);
  const member={uid:session.id,name:profile.name,color:profile.color,picture:profile.picture||'',rating:'0.0'};
  if(i>0){
    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({members:firebase.firestore.FieldValue.arrayRemove(p.joined[i])});}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined.splice(i,1);save('keode.posts.v2',KEO);}
    toast('Đã huỷ yêu cầu tham gia.');
  }else if(i===0){toast('Bạn là chủ kèo này mà!');return;}
  else{
    if(p.joined.length>=p.total){toast('Kèo đã đủ người rồi — hẹn kèo khác nhé!');return;}
    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({members:firebase.firestore.FieldValue.arrayUnion(member)});}catch(e){toast('Lỗi cloud: '+e.message);return;}}
    else{p.joined.push(member);save('keode.posts.v2',KEO);}
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');
  }
  if(MODE!=='cloud'){openDetail(id);renderFeed();}
}`, 'toggleJoin');

/* ---- 7. join nhanh trên card: id chuỗi + chặn kèo hết hạn ---- */
rep(`    const id=+joinB.closest('.kcard').dataset.id;
    const p=KEO.find(x=>x.id===id);if(!p)return;
    if(whenInfo(p).past){toast('Kèo đã diễn ra rồi — hẹn kèo khác nhé!');return;}`,
`    const id=joinB.closest('.kcard').dataset.id;
    const p=allKeo().find(x=>String(x.id)===String(id));if(!p)return;
    if(whenInfo(p).past||isExpired(p)){toast('Kèo đã diễn ra / đã ẩn — hẹn kèo khác nhé!');return;}`, 'quick join');

/* ---- 8. kform submit: async + expiry + cloud ---- */
rep(`$('#kform').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  const vibes=\$$('#vibeChips input:checked').map(i=>i.value);
  const p={
    id:nextId(),cat:f.rcat.value,title:f.fname.value.trim(),desc:f.fdesc.value.trim(),
    vibes,place:f.fplace.value.trim(),district:f.fDistrict.value,
    date:f.fdate.value,time:f.ftime.value,total:Math.min(20,Math.max(2,+f.fnum.value||6)),
    pay:f.rpay.value,partner:prefillPartner?prefillPartner.id:null,
    joined:[{name:profile.name,color:profile.color,picture:profile.picture||'',rating:'0.0'}],created:Date.now()
  };
  KEO.unshift(p);save('keode.posts.v2',KEO);
  f.reset();prefillPartner=null;\$('#partnerHint').classList.add('hide');
  closeModal();renderAll();
  route('discover');
  toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
});`,
`$('#kform').addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target;
  const vibes=\$$('#vibeChips input:checked').map(i=>i.value);
  const member={uid:session.id,name:profile.name,color:profile.color,picture:profile.picture||'',rating:'0.0'};
  const evT=new Date(f.fdate.value+'T'+(f.ftime.value||'00:00')).getTime();
  const expH=+f.fexp.value;
  const expiresAt=expH?evT+expH*3600000:null;
  const base={cat:f.rcat.value,title:f.fname.value.trim(),desc:f.fdesc.value.trim(),
    vibes,place:f.fplace.value.trim(),district:f.fDistrict.value,
    date:f.fdate.value,time:f.ftime.value,total:Math.min(20,Math.max(2,+f.fnum.value||6)),
    pay:f.rpay.value,partner:prefillPartner?prefillPartner.id:null,
    expiresAt,created:Date.now()};
  if(MODE==='cloud'&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
  }
  f.reset();prefillPartner=null;\$('#partnerHint').classList.add('hide');
  closeModal();
  route('discover');
  toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
});`, 'kform submit');

/* ---- 9. renderMine: uid + allKeo ---- */
rep(`  const mine=KEO.filter(p=>p.joined[0]&&p.joined[0].name===profile.name);
  const joined=KEO.filter(p=>p.joined[0]&&p.joined[0].name!==profile.name&&p.joined.some(m=>m.name===profile.name));`,
`  const mine=allKeo().filter(p=>p.joined[0]&&p.joined[0].uid===session.id);
  const joined=allKeo().filter(p=>p.joined[0]&&p.joined[0].uid!==session.id&&p.joined.some(m=>m.uid===session.id));`, 'renderMine');

/* ---- 10. resetKeo: cloud xoá kèo của mình ---- */
rep(`$('#resetKeo').addEventListener('click',()=>{
  if(!KEO.length){toast('Chưa có kèo nào để xoá.');return;}
  if(!confirm('Xoá toàn bộ kèo đã tạo? (demo)'))return;
  KEO=[];save('keode.posts.v2',KEO);closeRadarPop();renderAll();
  toast('Đã xoá hết kèo — bảng tin đang trống.');
});`,
`$('#resetKeo').addEventListener('click',()=>{
  if(!allKeo().length){toast('Chưa có kèo nào để xoá.');return;}
  if(!confirm('Xoá toàn bộ kèo đã tạo? (demo)'))return;
  if(MODE==='cloud'&&db){
    const mine=CLOUD_KEO.filter(p=>p.joined[0]&&p.joined[0].uid===session.id);
    Promise.all(mine.map(p=>db.collection('keos').doc(String(p.id)).delete()))
      .then(()=>toast('Đã xoá các kèo của bạn khỏi cloud.'))
      .catch(err=>toast('Lỗi cloud: '+err.message));
  }else{
    KEO=[];save('keode.posts.v2',KEO);closeRadarPop();renderAll();
    toast('Đã xoá hết kèo — bảng tin đang trống.');
  }
});`, 'resetKeo');

/* ---- 11. startSession: kích hoạt cloud ---- */
rep(`function startSession(s){
  session=s;save('keode.session.v1',s);
  toast('Đăng nhập thành công: '+s.name);
  route('onboard');applyRoute();
}`,
`async function initCloud(){
  try{
    await ensureFirebase();
    await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
    db=firebase.firestore();
    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
      CLOUD_KEO=snap.docs.map(d=>Object.assign({id:d.id},d.data()));
      cloudConnecting=false;
      if(MODE!=='cloud'){MODE='cloud';toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
      renderAll();updateModeBadge();
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});
  }catch(e){cloudConnecting=false;MODE='local';updateModeBadge();toast('Không kết nối được cloud — đang dùng chế độ máy bạn.');}
}
function startSession(s){
  session=s;save('keode.session.v1',s);
  toast('Đăng nhập thành công: '+(s.name||'bạn'));
  if(s.provider!=='demo'&&fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}
  route('onboard');applyRoute();
}`, 'startSession + initCloud');

/* ---- 12. renderAll: badge ---- */
rep(`function renderAll(){renderFeed();renderRadar();renderPartnerStrip();renderMine();renderVenues();}`,
`function renderAll(){renderFeed();renderRadar();renderPartnerStrip();renderMine();renderVenues();updateModeBadge();}`, 'renderAll');

/* ---- 13. applyRoute: policy view + badge ---- */
rep(`  const loginEl=\$('#view-login'),obEl=\$('#view-onboard'),appEl=\$('#view-app');`,
`  const loginEl=\$('#view-login'),obEl=\$('#view-onboard'),appEl=\$('#view-app'),polEl=\$('#view-policy');
  polEl.classList.add('hide');
  if(h==='policy'){loginEl.classList.add('hide');appEl.classList.add('hide');obEl.classList.add('hide');polEl.classList.remove('hide');renderPolicy();window.scrollTo(0,0);return;}`, 'applyRoute policy');

rep(`  if(page==='discover'){renderFeed();renderRadar();}`,
`  if(page==='discover'){renderFeed();renderRadar();updateModeBadge();}`, 'applyRoute badge');

/* ---- 14. deleteKeo + wiring ---- */
rep(`$('#detailBody').addEventListener('click',e=>{
  if(e.target.closest('#joinBtn')){toggleJoin(currentKeoId);return;}`,
`$('#detailBody').addEventListener('click',e=>{
  if(e.target.closest('#delBtn')){deleteKeo(currentKeoId);return;}
  if(e.target.closest('#joinBtn')){toggleJoin(currentKeoId);return;}`, 'detail delBtn');

rep(`/* ================= PAGES: mine / venues ================= */`,
`async function deleteKeo(id){
  const p=allKeo().find(x=>String(x.id)===String(id));if(!p)return;
  if(!(isHostOf(p)||isAdmin())){toast('Chỉ chủ kèo hoặc quản trị viên mới xoá được.');return;}
  if(!confirm('Xoá kèo này? Hành động không thể hoàn tác.'))return;
  if(MODE==='cloud'&&db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();
  }
  toast('Đã xoá kèo.');
  route('discover');
}

/* ================= PAGES: mine / venues ================= */`, 'deleteKeo');

/* ---- 15. Phone OTP handlers (sau demoLink) ---- */
rep(`\$('#demoLink').addEventListener('click',()=>{
  session={provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''};
  save('keode.session.v1',session);
  route('onboard');applyRoute();
});`,
`\$('#demoLink').addEventListener('click',()=>{
  session={provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''};
  save('keode.session.v1',session);
  route('onboard');applyRoute();
});
/* ---- Đăng nhập số điện thoại (Firebase Phone OTP — cần bật Phone provider; SMS thật cần bật billing, số test miễn phí trong console) ---- */
\$('#phSend').addEventListener('click',async ()=>{
  let n=(\$('#phNum').value||'').replace(/\\D/g,'');
  if(n.startsWith('84'))n=n.slice(2);
  if(!n.startsWith('0'))n='0'+n;
  if(n.length<10){toast('Nhập số điện thoại Việt Nam hợp lệ (vd: 0909123456).');return;}
  if(!fbValid(FB)){toggleCfg(true);toast('Cần cấu hình Firebase trước khi dùng OTP.');return;}
  try{
    await ensureFirebase();
    if(!window.recaptchaVerifier)window.recaptchaVerifier=new firebase.auth.RecaptchaVerifier('recaptcha-box',{size:'invisible'});
    \$('#phSend').disabled=true;\$('#phSend').textContent='Đang gửi…';
    confirmResult=await firebase.auth().signInWithPhoneNumber('+84'+n.slice(1),window.recaptchaVerifier);
    \$('#phCodeRow').classList.remove('hide');
    toast('Đã gửi mã OTP tới +84'+n.slice(1));
  }catch(e){handleAuthErr(e);}
  finally{\$('#phSend').disabled=false;\$('#phSend').textContent='Gửi lại mã';}
});
\$('#phVerify').addEventListener('click',async ()=>{
  const code=(\$('#phCode').value||'').replace(/\\D/g,'');
  if(!confirmResult||code.length<6){toast('Nhập mã 6 số vừa nhận được.');return;}
  try{
    const cred=await confirmResult.confirm(code);
    startSession({provider:'phone',id:cred.user.uid,name:cred.user.displayName||'',email:cred.user.email||'',picture:cred.user.photoURL||''});
  }catch(e){handleAuthErr(e);}
});`, 'phone handlers');

/* ---- 16. logout: signOut firebase ---- */
rep(`  session=null;profile=null;
  localStorage.removeItem('keode.session.v1');`,
`  session=null;profile=null;
  if(window.firebase)try{firebase.auth().signOut();}catch(e){}
  localStorage.removeItem('keode.session.v1');`, 'logout signOut');

/* ---- 17. POLICY ---- */
rep(`/* ================= ROUTING ================= */`,
`/* ================= POLICY ================= */
const POLICY={
 terms:{items:[
  ['1. Về dịch vụ','KÈO ĐÊ là nền tảng giúp người dùng tạo và tham gia các hoạt động gặp gỡ ("kèo") tại TP. Hồ Chí Minh. Đây là bản mẫu thiết kế (prototype).'],
  ['2. Điều kiện sử dụng','Bạn phải từ 18 tuổi trở lên và sử dụng thông tin đăng nhập chính là của mình (Google, Facebook hoặc số điện thoại).'],
  ['3. Tài khoản','Bạn chịu trách nhiệm với mọi hoạt động phát sinh dưới tài khoản của mình. Không mượn, bán hay chia sẻ tài khoản.'],
  ['4. Quy tắc đăng kèo','Nội dung kèo phải chân thực (đúng thời gian, địa điểm, số người). Cấm: lừa đảo, quảng cáo trá hình (quán muốn hợp tác hãy dùng kênh "Quán liên kết"), nội dung dung tục, kích động bạo lực, vi phạm pháp luật Việt Nam.'],
  ['5. Gặp gỡ & trách nhiệm cá nhân','KÈO ĐÊ chỉ là cầu nối. Mọi buổi gặp là tự nguyện giữa những người trưởng thành — bạn tự chịu trách nhiệm về an toàn và quyết định cá nhân. Hãy luôn tuân thủ hướng dẫn an toàn trong trang chi tiết kèo.'],
  ['6. Huỷ / hụt kèo','Chủ kèo nên báo trước nếu thay đổi kế hoạch. Hụt hẹn nhiều lần không lý do sẽ làm giảm điểm uy tín và có thể bị hạn chế tạo kèo.'],
  ['7. Kèo tự ẩn','Mỗi kèo có thời hạn hiển thị do chủ kèo chọn khi tạo. Kèo hết hạn sẽ ẩn khỏi bảng tin nhưng vẫn nằm trong "Kèo của tôi" để bạn xoá.'],
  ['8. Quán đối tác','Ưu đãi tại quán do quán tự công bố và chịu trách nhiệm. KÈO ĐÊ không bảo chứng chất lượng sản phẩm/dịch vụ của quán. Quán hợp tác chính thức phải qua xác minh của chủ hệ thống (Lê Hoàng Vũ).'],
  ['9. Xử lý vi phạm','Chủ hệ thống có quyền xoá nội dung, cảnh báo, hạn chế hoặc khoá tài khoản vi phạm.'],
  ['10. Thay đổi điều khoản','Điều khoản có thể được cập nhật; tiếp tục sử dụng nghĩa là bạn chấp nhận phiên bản mới. Luật áp dụng: pháp luật Việt Nam.']
 ]},
 privacy:{items:[
  ['1. Dữ liệu chúng tôi thu','Khi đăng nhập: tên hiển thị, email, ảnh đại diện (từ Google / Facebook) hoặc số điện thoại (khi dùng OTP). Khi sử dụng dịch vụ: nội dung kèo bạn tạo (tiêu đề, địa điểm, thời gian, mô tả) và các lượt tham gia.'],
  ['2. Mục đích sử dụng','Vận hành nền tảng; hiển thị tên/ảnh của bạn trong các kèo; giúp chủ kèo và thành viên liên hệ nhau; đảm bảo an toàn cộng đồng; phản hồi cho quán đối tác khi kèo diễn ra tại quán đó.'],
  ['3. Lưu trữ','Chế độ cloud: dữ liệu lưu trên Firebase (Google Cloud) — có thể tại máy chủ ngoài Việt Nam. Chế độ demo: dữ liệu chỉ nằm trên thiết bị của bạn (localStorage), không gửi đi đâu.'],
  ['4. Không bán dữ liệu','Chúng tôi không bán và không chia sẻ dữ liệu của bạn cho bên thứ ba cho mục đích marketing. Quán đối tác chỉ nhận thông tin liên quan khi kèo của bạn diễn ra tại quán đó.'],
  ['5. Quyền của bạn','Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân: bạn có quyền biết, xem, sửa, rút lại đồng ý và yêu cầu xoá dữ liệu. Xoá kèo: dùng nút Xoá kèo. Xoá tài khoản / toàn bộ dữ liệu: liên hệ chủ hệ thống.'],
  ['6. Thời gian lưu','Dữ liệu được lưu đến khi bạn xoá hoặc yêu cầu xoá. Kèo hết hạn tự ẩn khỏi bảng tin nhưng vẫn thuộc quyền xoá của bạn.'],
  ['7. Bảo mật','Mật khẩu không đi qua hệ thống (đăng nhập do Google/Facebook/Firebase xử lý). Kết nối qua HTTPS. Token đăng nhập chưa được verify phía server ở bản mẫu — production bắt buộc phải verify.'],
  ['8. Liên hệ','Lê Hoàng Vũ — Facebook: facebook.com/SharkHunter01 · Zalo: 0328206839.'],
  ['9. Cập nhật','Chính sách có thể được cập nhật và sẽ được đăng tại trang này.']
 ]},
 safety:{items:[
  ['3 nguyên tắc vàng','1) Ưu tiên gặp ở nơi công cộng, đông người. 2) Tự chủ phương tiện di lại của mình. 3) Báo cho người thân biết lịch trình và chia sẻ vị trí khi đi kèo khuya.'],
  ['Kèo đi khuya','Kèo sau 22h sẽ có cảnh báo đỏ trên bảng tin. Hãy đi cùng nhau, không đi một mình về muộn, ưu tiên xe riêng hoặc xe công nghệ.'],
  ['Rượu bia','Không uống rượu bia nếu phải lái xe. Tuyệt đối không mời rượu bia người dưới 18 tuổi.'],
  ['Lừa đảo — dấu hiệu đỏ','Tuyệt đối không chuyển tiền đặt cọc cho người lạ. Kèo yêu cầu chuyển tiền trước là dấu hiệu đỏ — báo cáo ngay.'],
  ['Báo cáo & chặn','Gặp hành vi quấy rối, lừa đảo, đe dọa: liên hệ chủ hệ thống (Facebook/Zalo ở trên). Vi phạm nặng sẽ bị khoá vĩnh viễn.'],
  ['Điểm uy tín','Tham gia đúng giờ, được đánh giá tốt → điểm uy tín tăng. Hụt hẹn, quấy rối → điểm giảm, có thể bị hạn chế tạo kèo.']
 ]}
};
let policyTab='terms';
function renderPolicy(){
  const d=POLICY[policyTab];
  \$('#policyBody').innerHTML=d.items.map(it=>'<h3>'+it[0]+'</h3><p>'+it[1]+'</p>').join('');
  \$$('.ptab').forEach(b=>b.classList.toggle('on',b.dataset.pt===policyTab));
}
\$('#policyBody').closest('.wrap').addEventListener('click',e=>{
  const b=e.target.closest('.ptab');if(!b)return;
  policyTab=b.dataset.pt;renderPolicy();
});
\$('#policyBack').addEventListener('click',()=>{
  if(session&&profile){route('discover');applyRoute();}
  else{location.hash='';applyRoute();}
});

/* ================= ROUTING ================= */`, 'policy block');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch C OK');
process.exit(missing.length ? 1 : 0);

// v0.9 patch C: JS — tài khoản email, KYC CCCD, badge xác minh, admin duyệt, policy.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. State: accounts + kyc + verified */
rep(`let adminPass=load('keode.adminpass.v1',null)||hashStr('admin123');`,
`let adminPass=load('keode.adminpass.v1',null)||hashStr('admin123');
let ACCOUNTS=load('keode.accounts.v1',[]);
if(!Array.isArray(ACCOUNTS))ACCOUNTS=[];
let KYC=load('keode.kyc.v1',[]);
if(!Array.isArray(KYC))KYC=[];
let VERIFIED_L=load('keode.verified.v1',{});
if(typeof VERIFIED_L!=='object'||!VERIFIED_L)VERIFIED_L={};
let CLOUD_VERIFIED={},KYC_C=[];
function verifiedOf(uid){const m=(MODE==='cloud')?CLOUD_VERIFIED:VERIFIED_L;return !!m[uid];}
function myVerify(){
  if(!session)return'none';
  if(verifiedOf(session.id))return'verified';
  const q=(MODE==='cloud')?KYC_C:KYC;
  return q.some(x=>String(x.uid)===String(session.id))?'pending':'none';
}
function saveAccounts(){save('keode.accounts.v1',ACCOUNTS);}
function saveKYC(){save('keode.kyc.v1',KYC);}
function saveVerified(){save('keode.verified.v1',VERIFIED_L);}
function badgeHTML(uid,compact){
  if(verifiedOf(uid))return ' <span class="vtag">✓ Đã XM</span>';
  return compact?' <span class="uvt">⚠ Chưa XM</span>':' <span class="uvt">⚠ Chưa xác minh</span>';
}
function updateKycBanner(){
  const b=$('#kycBanner');if(!b)return;
  if(!session){b.classList.add('hide');return;}
  const st=myVerify();
  b.classList.remove('hide','wait','ok');
  if(st==='verified'){b.classList.add('ok');b.innerHTML='<p>✓ Tài khoản đã xác minh danh tính — anh em tin nhau hơn khi đi kèo.</p>';}
  else if(st==='pending'){b.classList.add('wait');b.innerHTML='<p>⏳ Hồ sơ xác minh đang chờ duyệt — bạn vẫn tìm & đăng kèo bình thường.</p><button class="btn btn-sm" type="button" id="kybOpen">Xem hồ sơ</button>';}
  else{b.innerHTML='<p>⚠ Tài khoản CHƯA XÁC MINH — vẫn tìm & đăng kèo bình thường, nhưng xác minh CCCD giúp anh em tin nhau hơn.</p><button class="btn btn-sm btn-p" type="button" id="kybOpen">🪪 Xác minh ngay</button>';}
  const o=$('#kybOpen');if(o)o.addEventListener('click',()=>{openKyc();});
}`, 'state kyc');

/* 2. cardHTML: badge chủ kèo */
rep(`<span><b>\${esc(p.joined[0].name)}</b> · chủ kèo</span>`,
`<span><b>\${esc(p.joined[0].name)}</b>\${badgeHTML(p.joined[0].uid,true)}</span>`, 'cardHTML badge');

/* 3. detail: host badge + member badge */
rep(`<span class="n">\${esc(p.joined[0].name)}<em>· chủ kèo</em></span>`,
`<span class="n">\${esc(p.joined[0].name)}<em>· chủ kèo</em></span>\${verifiedOf(p.joined[0].uid)?'<span class="vtag">✓ Đã xác minh</span>':'<span class="uvt">⚠ Chưa xác minh</span>'}`, 'detail host badge');
rep(`\${i===0?'<span class="mtag">CHỦ KÈO</span>':''}`,
`\${i===0?'<span class="mtag">CHỦ KÈO</span>':''}\${verifiedOf(m.uid)?'<span class="vtag">✓</span>':'<span class="uvt">⚠ Chưa XM</span>'}`, 'mem badge');

/* 4. renderFeed: cập nhật banner */
rep(`  \$('#rescount').textContent=KEO.length?list.length+'/'+KEO.length+' kèo':'';`,
`  \$('#rescount').textContent=allKeo().length?list.length+'/'+allKeo().length+' kèo':'';
  updateKycBanner();`, 'renderFeed badge+count');

/* 5. initCloud: verifications + kyc snapshots */
rep(`    db=firebase.firestore();
    firebase.auth().useDeviceLanguage();`,
`    db=firebase.firestore();
    firebase.auth().useDeviceLanguage();
    db.collection('verifications').onSnapshot(s=>{CLOUD_VERIFIED={};s.forEach(d=>{CLOUD_VERIFIED[d.id]=d.data()||{};});if(MODE==='cloud')renderAll();});
    db.collection('kyc').onSnapshot(s=>{KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();});`, 'initCloud snapshots');

/* 6. renderAdminBody: nhánh kyc (trước requests) + đếm */
rep(`  }else if(aTab==='requests'){
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Đối tác</div><h2>Yêu cầu của quán (\${VREQ.length})</h2></div></div>`,
`  }else if(aTab==='kyc'){
    const Q=(MODE==='cloud')?KYC_C:KYC;
    const kc=\$('#kycCount');if(kc)kc.textContent=Q.length||'';
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">An toàn</div><h2>Xác minh CCCD (\${Q.length} chờ duyệt)</h2></div></div>
      \${Q.length?Q.map(k=>\`
      <div class="acard">
        <h3>\${esc(k.name)}</h3>
        <div style="font-size:12.5px;color:var(--mut);margin-bottom:8px">\${esc(k.email||'—')} · gửi \${new Date(k.at).toLocaleString('vi-VN')}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="\${k.cccd}" target="_blank" rel="noopener"><img src="\${k.cccd}" class="kthumb" alt="CCCD" style="width:150px;border-radius:10px;border:1px solid var(--line)"></a>
          <a href="\${k.selfie}" target="_blank" rel="noopener"><img src="\${k.selfie}" class="kthumb" alt="Selfie" style="width:150px;border-radius:10px;border:1px solid var(--line)"></a>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="abtn" data-act="kycok" data-id="\${k.uid}" type="button">✓ Duyệt — gắn thẻ xác minh</button>
          <button class="abtn danger" data-act="kycno" data-id="\${k.uid}" type="button">Từ chối</button>
        </div>
        <p class="crt-soon">Sau quyết định: ảnh CCCD/selfie bị XOÁ vĩnh viễn, chỉ giữ trạng thái xác minh (theo chính sách).</p>
      </div>\`).join(''):\`<div class="empty"><p>Không có yêu cầu chờ duyệt</p></div>\`}\`;
  }else if(aTab==='requests'){
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Đối tác</div><h2>Yêu cầu của quán (\${VREQ.length})</h2></div></div>`, 'admin kyc tab');

/* 7. adminBody click: duyệt/từ chối KYC */
rep(`  else if(act==='admlogout'){adminS=null;localStorage.removeItem('keode.admin.v1');renderAdminView();toast('Đã đăng xuất quản trị.');}`,
`  else if(act==='kycok'){
    if(MODE==='cloud'&&db){
      Promise.all([
        db.collection('verifications').doc(String(id)).set({at:Date.now(),by:'admin'}),
        db.collection('kyc').doc(String(id)).delete()
      ]).then(()=>{renderAdminBody();toast('✓ Đã gắn thẻ xác minh.');}).catch(err=>toast('Lỗi cloud: '+err.message));
    }else{
      VERIFIED_L[id]={at:Date.now(),by:'admin'};saveVerified();
      KYC=KYC.filter(x=>String(x.uid)!==String(id));saveKYC();
      renderAdminBody();renderFeed();toast('✓ Đã gắn thẻ xác minh.');
    }
  }
  else if(act==='kycno'){
    if(!confirm('Từ chối yêu cầu này? Ảnh sẽ bị xoá, người dùng có thể gửi lại.'))return;
    if(MODE==='cloud'&&db){db.collection('kyc').doc(String(id)).delete().catch(()=>{});}
    else{KYC=KYC.filter(x=>String(x.uid)!==String(id));saveKYC();}
    renderAdminBody();toast('Đã từ chối yêu cầu.');
  }
  else if(act==='admlogout'){adminS=null;localStorage.removeItem('keode.admin.v1');renderAdminView();toast('Đã đăng xuất quản trị.');}`, 'admin kyc handlers');

/* 8. Registration + email login */
rep(`\$('#demoLink').addEventListener('click',()=>{`,
`/* ---- Tạo tài khoản / đăng nhập email (Firebase khi có config, local demo khi chưa) ---- */
let regIsLogin=false;
\$('#regSwitch').addEventListener('click',()=>{
  regIsLogin=!regIsLogin;
  \$('#regBtn').textContent=regIsLogin?'Đăng nhập bằng email':'Tạo tài khoản';
  \$('#regSwitch').textContent=regIsLogin?'Chưa có tài khoản? Đăng ký':'Đã có tài khoản? Đăng nhập';
  \$('#regName').style.display=regIsLogin?'none':'block';
  \$('#regErr').classList.add('hide');
});
\$('#regBtn').addEventListener('click',async ()=>{
  const name=\$('#regName').value.trim(),email=\$('#regEmail').value.trim(),pass=\$('#regPass').value;
  const err=m=>{const el=\$('#regErr');el.textContent=m;el.classList.remove('hide');};
  if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email))return err('Email chưa đúng định dạng.');
  if(pass.length<6)return err('Mật khẩu tối thiểu 6 ký tự.');
  if(!regIsLogin&&!name)return err('Điền tên hiển thị nhé.');
  if(fbValid(FB)){
    try{
      let u;
      if(regIsLogin){u=(await firebase.auth().signInWithEmailAndPassword(email,pass)).user;}
      else{
        u=(await firebase.auth().createUserWithEmailAndPassword(email,pass)).user;
        try{await u.updateProfile({displayName:name});}catch(e2){}
      }
      startSession({provider:'email',id:u.uid,name:u.displayName||name||'Bạn',email:u.email||email,picture:u.photoURL||''});
      return;
    }catch(e){
      if(e.code==='auth/email-already-in-use')return err('Email này đã có tài khoản — bấm "Đã có tài khoản? Đăng nhập".');
      if(e.code==='auth/invalid-credential'||e.code==='auth/wrong-password')return err('Email hoặc mật khẩu không đúng.');
      return err('Lỗi: '+(e.message||e.code));
    }
  }
  const ph=hashStr(pass);
  let acc=ACCOUNTS.find(a=>a.email===email);
  if(regIsLogin){
    if(!acc||acc.passHash!==ph)return err('Email hoặc mật khẩu không đúng (demo trên máy này).');
  }else{
    if(acc)return err('Email này đã đăng ký trên máy — bấm "Đã có tài khoản? Đăng nhập".');
    acc={uid:'u'+Date.now(),email,passHash:ph,name:name||'Bạn',color:AVCOLORS[ACCOUNTS.length%AVCOLORS.length],verify:'none',at:Date.now()};
    ACCOUNTS.push(acc);saveAccounts();
  }
  session={provider:'email',id:acc.uid,name:acc.name,email:acc.email,picture:''};
  save('keode.session.v1',session);
  toast('Đăng nhập thành công: '+acc.name);
  route('onboard');applyRoute();
});
\$('#demoLink').addEventListener('click',()=>{`, 'reg handlers');

/* 9. KYC modal logic (chèn trước ROUTING) */
rep(`/* ================= ROUTING ================= */`,
`/* ================= XÁC MINH CCCD ================= */
let kycCccd=null,kycSelfie=null;
function readImage(file,cb){
  const r=new FileReader();
  r.onload=()=>{const img=new Image();img.onload=()=>{const max=900,sc=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*sc));c.height=Math.max(1,Math.round(img.height*sc));c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',0.82));};img.onerror=()=>cb(null);img.src=r.result;};
  r.onerror=()=>cb(null);
  r.readAsDataURL(file);
}
function openKyc(){closeRadarPop();renderKyc();\$('#kycOverlay').classList.remove('hide');document.body.style.overflow='hidden';}
function closeKyc(){\$('#kycOverlay').classList.add('hide');document.body.style.overflow='';}
function renderKyc(){
  const body=\$('#kycBody'),st=myVerify();
  if(st==='verified'){
    const v=(MODE==='cloud')?CLOUD_VERIFIED[session.id]:VERIFIED_L[session.id];
    body.innerHTML=\`<div class="latewarn" style="background:var(--green-t);border-color:var(--green);color:var(--green)">✓ Tài khoản của bạn ĐÃ XÁC MINH\${v&&v.at?' lúc '+new Date(v.at).toLocaleString('vi-VN'):''}.</div>
      <p style="font-size:13px;color:var(--mut)">Ảnh CCCD/selfie bạn gửi đã bị XOÁ VĨNH VIỄN theo Chính sách quyền riêng tư — chỉ giữ lại trạng thái xác minh.</p>\`;
    return;
  }
  if(st==='pending'){
    body.innerHTML=\`<div class="kycbanner wait" style="display:flex;margin:0 0 10px">⏳ Hồ sơ đang chờ duyệt…</div>
      <p style="font-size:13px;color:var(--mut)">Chủ hệ thống thường duyệt trong 24h. Trong lúc chờ bạn vẫn tìm kèo & đăng kèo bình thường.</p>
      <button class="btn" type="button" id="kycWithdraw">Huỷ yêu cầu (xoá ảnh đã gửi)</button>\`;
    \$('#kycWithdraw').addEventListener('click',()=>{if(!confirm('Huỷ yêu cầu xác minh? Ảnh đã gửi sẽ bị xoá ngay.'))return;withdrawKyc();renderKyc();updateKycBanner();});
    return;
  }
  const rejected=(profile&&profile.verify==='rejected');
  body.innerHTML=\`
    \${rejected?'<div class="latewarn">Yêu cầu trước bị từ chối — chụp lại rõ nét hơn và gửi lại nhé.</div>':''}
    <p style="font-size:13.5px;color:var(--mut)">Tải lên <b>2 ảnh</b>: mặt trước CCCD + một ảnh chân dung (selfie) cầm/kề CCCD. <b>Chỉ chủ hệ thống được xem</b> để đối chiếu; ảnh bị xoá vĩnh viễn trong vòng 7 ngày sau khi ra quyết định. Chi tiết: <a class="linklike" href="#policy">Chính sách xử lý CCCD</a>.</p>
    <div class="kslot\${kycCccd?' has':''}"><span class="kh">📷 Ảnh mặt trước CCCD</span><br><input type="file" id="kcccd" accept="image/*" class="hide"><label for="kcccd" class="btn btn-sm" style="margin-top:6px">Chọn ảnh</label><img id="kcccdPrev" class="\${kycCccd?'':'hide'}" style="max-height:150px" src="\${kycCccd||''}"></div>
    <div class="kslot\${kycSelfie?' has':''}"><span class="kh">🤳 Ảnh chân dung (selfie)</span><br><input type="file" id="kselfie" accept="image/*" class="hide"><label for="kselfie" class="btn btn-sm" style="margin-top:6px">Chọn ảnh</label><img id="kselfiePrev" class="\${kycSelfie?'':'hide'}" style="max-height:150px" src="\${kycSelfie||''}"></div>
    <label class="kycagree"><input type="checkbox" id="kAgree"> Tôi xác nhận đây là CCCD của chính mình và đồng ý <a class="linklike" href="#policy">Chính sách xử lý CCCD</a> (chỉ admin xem; ảnh xoá trong 7 ngày sau quyết định).</label>
    <button class="btn btn-p" type="button" id="kycSubmit" style="width:100%">Gửi yêu cầu xác minh</button>\`;
  \$('#kcccd').addEventListener('change',e=>{const fl=e.target.files[0];if(!fl)return;readImage(fl,d=>{if(!d){toast('Ảnh không đọc được.');return;}kycCccd=d;renderKyc();});});
  \$('#kselfie').addEventListener('change',e=>{const fl=e.target.files[0];if(!fl)return;readImage(fl,d=>{if(!d){toast('Ảnh không đọc được.');return;}kycSelfie=d;renderKyc();});});
  \$('#kycSubmit').addEventListener('click',()=>{
    if(!kycCccd||!kycSelfie){toast('Thiếu ảnh CCCD hoặc ảnh chân dung.');return;}
    if(!\$('#kAgree').checked){toast('Bạn cần đồng ý Chính sách xử lý CCCD.');return;}
    submitKyc();
  });
}
async function submitKyc(){
  const data={uid:session.id,name:profile.name,email:session.email||profile.email||'',cccd:kycCccd,selfie:kycSelfie,status:'pending',at:Date.now()};
  if(MODE==='cloud'&&db){
    try{await db.collection('kyc').doc(session.id).set(data);}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{
    KYC=KYC.filter(x=>String(x.uid)!==String(session.id));KYC.unshift(data);saveKYC();
  }
  kycCccd=null;kycSelfie=null;
  renderKyc();updateKycBanner();
  toast('Đã gửi yêu cầu xác minh! Chờ chủ hệ thống duyệt nhé.');
}
function withdrawKyc(){
  if(MODE==='cloud'&&db){db.collection('kyc').doc(session.id).delete().catch(()=>{});}
  else{KYC=KYC.filter(x=>String(x.uid)!==String(session.id));saveKYC();}
}
function closeKyc(){\$('#kycOverlay').classList.add('hide');document.body.style.overflow='';}
\$('#kycClose').addEventListener('click',()=>{closeKyc();});
\$('#kycOverlay').addEventListener('click',e=>{if(e.target===kycOverlay)closeKyc();});

/* ================= ROUTING ================= */`, 'kyc logic');

/* 10. usermenu: thêm mục Xác minh */
rep(`      <button class="btn" type="button" id="logoutBtn">Đăng xuất</button>`,
`      <button class="btn" type="button" id="kycMenuBtn" style="color:var(--navy)">🪪 Xác minh danh tính</button>
      <button class="btn" type="button" id="logoutBtn">Đăng xuất</button>`, 'usermenu kyc');
rep(`\$('#usermenu').addEventListener('click',e=>{
  if(!e.target.closest('#logoutBtn'))return;`,
`\$('#usermenu').addEventListener('click',e=>{
  if(e.target.closest('#kycMenuBtn')){\$('#usermenu').classList.add('hide');openKyc();return;}
  if(!e.target.closest('#logoutBtn'))return;`, 'usermenu kyc handler');

/* 11. Escape đóng KYC */
rep(`    else if(!mappop.classList.contains('hide'))closePop();`,
`    else if(!\$('#kycOverlay').classList.contains('hide'))closeKyc();
    else if(!mappop.classList.contains('hide'))closePop();`, 'escape kyc');

/* 12. POLICY: CCCD + giả mạo */
rep(`  ['5. Gặp gỡ & trách nhiệm cá nhân'`,
`  ['4b. Giả mạo danh tính','Tự ý gắn thẻ "Đã xác minh", dùng CCCD của người khác hoặc giả mạo hồ sơ = khoá vĩnh viễn. Thẻ "Đã xác minh" chỉ phản ánh kết quả đối chiếu của chủ hệ thống tại thời điểm duyệt — không thay thế giấy tờ pháp lý. Luôn tuân thủ hướng dẫn an toàn.'],
  ['5. Gặp gỡ & trách nhiệm cá nhân'`, 'ToS 4b');
rep(`  ['9. Cập nhật','Chính sách có thể được cập nhật và sẽ được đăng tại trang này.']`,
`  ['9. Xác minh danh tính (CCCD & selfie)','Khi bạn yêu cầu gắn thẻ "Đã xác minh", chúng tôi thu: (1) ảnh mặt trước CCCD bạn tải lên; (2) một ảnh chân dung kề CCCD. Mục đích duy nhất: chủ hệ thống đối chiếu và ra quyết định gắn thẻ. Phạm vi tiếp cận: CHỈ chủ hệ thống Lê Hoàng Vũ — không thành viên nào, không bên thứ ba. Xoá dữ liệu: ảnh bị XOÁ VĨNH VIỄN trong vòng 7 ngày kể từ khi ra quyết định duyệt/từ chối; sau đó chỉ giữ trạng thái "Đã xác minh" và thời điểm. Không chia sẻ, không dùng cho quảng cáo. Bạn có thể huỷ yêu cầu bất cứ lúc nào trước khi duyệt (ảnh xoá ngay) hoặc yêu cầu xoá trạng thái qua FB SharkHunter01 / Zalo 0328206839.'],
  ['10. Cập nhật','Chính sách có thể được cập nhật và sẽ được đăng tại trang này.']`, 'privacy CCCD');

/* 13. version */
rep(`KÈO ĐÊ — v0.8 "ADMIN PANEL"`, `KÈO ĐÊ — v0.9 "EMAIL ACCOUNTS + KYC CCCD"`, 'head version');
rep(`(prototype v0.8 · chỉ TP. Hồ Chí Minh)`, `(prototype v0.9 · chỉ TP. Hồ Chí Minh)`, 'footer version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v09 part2 OK');
process.exit(missing.length ? 1 : 0);

// v0.8: ADMIN PANEL — đăng nhập quản trị + sửa/xoá mọi kèo + quản lý quán đối tác + yêu cầu quán + cài đặt.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, b);
}

/* ============ 1. CSS ============ */
rep(`@media (max-width:1120px){`,
`/* ---------- ADMIN ---------- */
.abadge{font:800 10.5px "Be Vietnam Pro",sans-serif;letter-spacing:.12em;background:var(--amber);color:#3A2A00;border-radius:6px;padding:3px 8px;vertical-align:middle}
#view-admin .topbar{background:var(--navy)}
#view-admin .topbar .tb-word{color:#fff;text-shadow:none}
#atabs .tab{color:#B9C4EE}
#atabs .tab:hover{background:rgba(255,255,255,.08);color:#fff}
#atabs .tab.on{background:rgba(255,255,255,.16);color:#fff}
.acard{background:#fff;border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--sh-sm);padding:16px 18px;margin-bottom:16px}
.acard h3{font-family:"Baloo 2";font-weight:700;font-size:19px;color:var(--navy);margin-bottom:10px}
.astats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:18px}
.astat{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px;box-shadow:var(--sh-sm)}
.astat b{display:block;font-family:"Baloo 2";font-size:26px;color:var(--navy);line-height:1.1}
.astat span{font-size:12px;color:var(--mut)}
.atwrap{overflow-x:auto;background:#fff;border:1px solid var(--line);border-radius:12px}
.atable{width:100%;border-collapse:collapse;font-size:13px;min-width:760px}
.atable th{background:var(--blue-t);color:var(--navy);text-align:left;padding:9px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
.atable td{padding:8px 10px;border-top:1px solid var(--line);vertical-align:middle}
.atable tr:hover td{background:#F8FAFF}
.atitle{font-weight:600;color:var(--navy)}
.abtn{border:1.5px solid var(--line2);background:#fff;border-radius:9px;padding:5px 10px;font:600 12.5px "Be Vietnam Pro",sans-serif;color:var(--navy);cursor:pointer}
.abtn:hover{border-color:var(--blue);color:var(--blue)}
.abtn.danger{color:var(--pink);border-color:#F7C6D2}
.abtn.danger:hover{background:#FFF5F7;border-color:var(--pink)}
.agrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}
.acard input,.acard select,.acard textarea{width:100%;border:1.5px solid var(--line2);border-radius:10px;padding:9px 12px;font:500 14px "Be Vietnam Pro",sans-serif;color:var(--navy);outline:none}
.acard input:focus,.acard select:focus,.acard textarea:focus{border-color:var(--blue);box-shadow:0 0 0 4px var(--blue-t)}
.astat .chipst{font:700 11px "Be Vietnam Pro";padding:2px 8px;border-radius:999px;display:inline-block;margin-top:6px}
.st-open{background:var(--green-t);color:var(--green)}
.st-past{background:var(--line);color:var(--mut)}
.st-hid{background:var(--amber-t);color:#7A5200}

@media (max-width:1120px){`, 'admin css');

/* ============ 2. HTML: view-admin + venue modal ============ */
rep(`<!-- ============ MODAL: TẠO KÈO ============ -->`,
`<!-- ============ ADMIN ============ -->
<div id="view-admin" class="hide">
  <div id="adminLogin" class="hide">
    <div class="lmain" style="min-height:100vh;background:radial-gradient(700px 340px at 85% -6%, #DCE9FF 0%, transparent 60%), var(--bg)">
      <div class="logo">🍻 KÈO ĐÊ <span class="abadge">ADMIN</span></div>
      <div class="board" style="max-width:400px">
        <p class="blab">Đăng nhập quản trị</p>
        <input type="password" id="admPass" placeholder="Mật khẩu quản trị" style="width:100%;border:1.5px solid var(--line2);border-radius:12px;padding:11px 14px;font:500 15px 'Be Vietnam Pro',sans-serif;outline:none">
        <button id="admLoginBtn" class="btn btn-p" type="button" style="width:100%;margin-top:12px">Đăng nhập</button>
        <p class="err hide" id="admErr">Sai mật khẩu quản trị.</p>
        <p class="lsmall">Mật khẩu mặc định: <b>admin123</b> — hãy đổi ngay trong Cài đặt. (Bản mẫu: bảo mật cấp demo; production dùng Firebase custom claim.)</p>
        <p class="lsmall" style="margin-top:8px"><a class="linklike" href="#discover">← Về trang web</a></p>
      </div>
    </div>
  </div>
  <div id="adminPanel" class="hide">
    <header class="topbar">
      <div class="tb-word">🛠 KÈO ĐÊ <span class="abadge">ADMIN</span></div>
      <nav class="tabs" id="atabs">
        <button class="tab on" data-at="overview" type="button">Tổng quan</button>
        <button class="tab" data-at="keos" type="button">Quản lý kèo</button>
        <button class="tab" data-at="venues" type="button">Quán đối tác</button>
        <button class="tab" data-at="requests" type="button">Yêu cầu quán</button>
        <button class="tab" data-at="settings" type="button">Cài đặt</button>
      </nav>
      <div class="spacer"></div>
      <button class="btn btn-sm" id="admExit" type="button" style="color:#fff;background:transparent;border-color:rgba(255,255,255,.4)">Thoát</button>
    </header>
    <div class="wrap" id="adminBody" style="padding:22px 24px 60px"></div>
  </div>
</div>

<!-- ============ MODAL QUÁN ĐỐI TÁC (admin) ============ -->
<div class="overlay hide" id="venueOverlay">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="mhead">
      <h2 id="vmodalTitle">Quán đối tác</h2>
      <button class="pop-x" id="vmodalClose" type="button" aria-label="Đóng" style="width:34px;height:34px;font-size:15px;border:2px solid var(--line);background:var(--cream2);color:var(--ink)">✕</button>
    </div>
    <form id="veForm">
      <label class="flab" for="vEname">Tên quán</label>
      <input id="vEname" required maxlength="80" placeholder="vd: Sài Gòn Espresso Lab">
      <div class="f3" style="margin-top:10px">
        <div><label class="flab" for="vEdistrict">Quận</label><select id="vEdistrict"></select></div>
        <div><label class="flab" for="vEemoji">Icon</label><select id="vEemoji"><option>☕</option><option>🍜</option><option>🍿</option><option>🍻</option><option>⚽</option><option>✈️</option><option>🎤</option><option>🏀</option><option>🎮</option></select></div>
        <div><label class="flab" for="vEcat">Danh mục chính</label><select id="vEcat"></select></div>
      </div>
      <label class="flab" for="vEtags">Thẻ <small>(phải cách nhau dấu phẩy)</small></label>
      <input id="vEtags" maxlength="80" placeholder="vd: Cà phê đặc sản, Làm việc">
      <label class="flab" for="vEpromo">Ưu đãi cho kèo ghé quán</label>
      <input id="vEpromo" maxlength="80" placeholder="vd: Giảm 10% hoá đơn cho kèo ghé quán">
      <label class="flab" for="vEnote">Mô tả</label>
      <textarea id="vEnote" rows="2" maxlength="160" placeholder="Góc yên tĩnh, nhiều ổ cắm…"></textarea>
      <div class="fbtns" style="justify-content:flex-end">
        <button class="btn" type="button" id="vECancel">Huỷ</button>
        <button class="btn btn-p" type="submit">Lưu quán</button>
      </div>
    </form>
  </div>
</div>

<!-- ============ MODAL: TẠO KÈO ============ -->`, 'admin html');

/* ============ 3. Footer + login: link Quản trị ============ */
rep(`    <a href="#policy" style="color:var(--blue);text-decoration:none">An toàn cộng đồng</a>
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`,
`    <a href="#policy" style="color:var(--blue);text-decoration:none">An toàn cộng đồng</a> ·
    <a href="#admin" style="color:var(--mut);text-decoration:none">Quản trị</a>
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`, 'footer admin link');
rep(`        <button type="button" class="linklike" id="demoLink">Chưa có ID? Xem thử demo →</button>`,
`        <button type="button" class="linklike" id="demoLink">Chưa có ID? Xem thử demo →</button>
        <a class="linklike" href="#admin" style="color:var(--mut)">Quản trị</a>`, 'login admin link');

/* ============ 4. PARTNERS → quản lý được ============ */
rep(`const PARTNERS=[
  {id:'p1',name:'Sài Gòn Espresso Lab',district:'Quận 1',tags:['Cà phê đặc sản','Làm việc'],promo:'Giảm 10% hoá đơn cho kèo ghé quán',note:'Góc yên tĩnh, nhiều ổ cắm, nhạc lo-fi nhẹ nhàng.'},
  {id:'p2',name:'Bia Kè Corner',district:'Bình Thạnh',tags:['Bia craft','Xem bóng'],promo:'Tặng 1 đĩa đồ nhậu cho kèo từ 5 người',note:'Màn hình lớn bóng đá, ngồi vỉa hè mát rượi.'},
  {id:'p3',name:'Sân Cỏ Đề Phòng',district:'Gò Vấp',tags:['Đá banh','Sân 5'],promo:'Giờ vàng thuê sân giảm 50k cho mỗi kèo',note:'Sân cỏ nhân tạo 5 người, có nước uống.'}
];`,
`const SEED_PARTNERS=[
  {id:'p1',name:'Sài Gòn Espresso Lab',district:'Quận 1',tags:['Cà phê đặc sản','Làm việc'],promo:'Giảm 10% hoá đơn cho kèo ghé quán',note:'Góc yên tĩnh, nhiều ổ cắm, nhạc lo-fi nhẹ nhàng.',emoji:'☕'},
  {id:'p2',name:'Bia Kè Corner',district:'Bình Thạnh',tags:['Bia craft','Xem bóng'],promo:'Tặng 1 đĩa đồ nhậu cho kèo từ 5 người',note:'Màn hình lớn bóng đá, ngồi vỉa hè mát rượi.',emoji:'🍻'},
  {id:'p3',name:'Sân Cỏ Đề Phòng',district:'Gò Vấp',tags:['Đá banh','Sân 5'],promo:'Giờ vàng thuê sân giảm 50k cho mỗi kèo',note:'Sân cỏ nhân tạo 5 người, có nước uống.',emoji:'⚽'}
];
let PARTNERS=load('keode.partners.v1',null)||SEED_PARTNERS.slice();
const savePartners=()=>save('keode.partners.v1',PARTNERS);`, 'partners let');

/* ============ 5. isAdmin nâng cấp + hash ============ */
rep(`function isAdmin(){return !!(profile&&ADMIN_NAMES.includes(profile.name));}`,
`let adminS=load('keode.admin.v1',null);
function hashStr(s){let x=0x811c9dc5;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,0x01000193)>>>0;}let y=0x01000193;for(let i=s.length-1;i>=0;i--){y^=s.charCodeAt(i)+i;y=Math.imul(y,0x85ebca6b)>>>0;}return 'v1.'+x.toString(36)+'.'+y.toString(36);}
let adminPass=load('keode.adminpass.v1',null)||hashStr('admin123');
function isAdmin(){return !!(adminS&&adminS.role==='admin')||!!(profile&&ADMIN_NAMES.includes(profile.name));}`, 'isAdmin upgrade');

/* ============ 6. partnerEmoji dùng emoji chọn ============ */
rep(`const partnerEmoji=pt=>pt.tags[0]==='Cà phê đặc sản'?'☕':pt.tags[0]==='Bia craft'?'🍻':'⚽';`,
`const partnerEmoji=pt=>pt.emoji||(pt.tags[0]==='Cà phê đặc sản'?'☕':pt.tags[0]==='Bia craft'?'🍻':'⚽');
const partnerCat=pt=>pt.tags&&pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags&&pt.tags[0]==='Bia craft'?'Nhậu':'Đá banh';`, 'partnerEmoji');

/* ============ 7. openModal: hỗ trợ edit kèo ============ */
rep(`let prefillPartner=null;
function openModal(prefill){
  closeRadarPop();
  if(prefill&&prefill.partner){
    prefillPartner=prefill.partner;
    \$('#fplace').value=prefill.partner.name;
    \$('#fDistrict').value=prefill.partner.district;
    \$('#partnerHint').classList.remove('hide');
    \$('#partnerHint').textContent='Quán đối tác: '+prefill.partner.promo;
  }else{
    prefillPartner=null;\$('#partnerHint').classList.add('hide');
  }
  \$('#overlay').classList.remove('hide');
  document.body.style.overflow='hidden';
  setTimeout(()=>\$('#fname').focus(),30);
}`,
`let prefillPartner=null,editingKeoId=null;
function openModal(opts){
  opts=opts||{};
  closeRadarPop();
  if(opts.partner){
    prefillPartner=opts.partner;
    \$('#fplace').value=opts.partner.name;
    \$('#fDistrict').value=opts.partner.district;
    \$('#partnerHint').classList.remove('hide');
    \$('#partnerHint').textContent='Quán đối tác: '+opts.partner.promo;
  }else{
    prefillPartner=null;\$('#partnerHint').classList.add('hide');
  }
  if(opts.edit){
    editingKeoId=opts.edit;
    const p=allKeo().find(x=>String(x.id)===String(opts.edit));
    if(p){
      f.rcat.value=p.cat;f.fname.value=p.title;f.fdesc.value=p.desc||'';
      f.fplace.value=p.place;f.fDistrict.value=p.district;
      f.fdate.value=p.date||'';f.ftime.value=p.time||'';f.fnum.value=p.total;
      f.fexp.value=String(p.expHours!=null?p.expHours:24);
      f.rpay.value=p.pay||'Chia đều hóa đơn';
      \$$('#vibeChips input').forEach(i=>{i.checked=(p.vibes||[]).includes(i.value);i.disabled=false;});
      \$('#mtitle').textContent='SỬA KÈO';
      if(p.partner){const pt=partnerById(p.partner);if(pt){prefillPartner=pt;\$('#partnerHint').classList.remove('hide');\$('#partnerHint').textContent='Quán đối tác: '+pt.promo;}}
    }
  }else{
    editingKeoId=null;
    \$('#mtitle').textContent='Tạo kèo mới';
  }
  \$('#overlay').classList.remove('hide');
  document.body.style.overflow='hidden';
  setTimeout(()=>\$('#fname').focus(),30);
}`, 'openModal edit');

/* ============ 8. kform submit: create vs update ============ */
rep(`  if(MODE==='cloud'&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
  }else{
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
  }
  f.reset();prefillPartner=null;\$('#partnerHint').classList.add('hide');
  closeModal();
  route('discover');
  toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');`,
`  if(editingKeoId){
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
  }else if(MODE==='cloud'&&db){
    try{await db.collection('keos').add(Object.assign({hostUid:session.id,joined:[member]},base));}
    catch(err){toast('Lỗi cloud: '+err.message);return;}
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }else{
    KEO.unshift(Object.assign({id:nextId(),joined:[member],done:false},base));
    save('keode.posts.v2',KEO);renderAll();
    toast('Đăng kèo thành công! Kèo của bạn đang chờ người rủ.');
  }
  f.reset();prefillPartner=null;editingKeoId=null;\$('#partnerHint').classList.add('hide');
  closeModal();
  route('discover');`, 'kform edit');

/* ============ 9. applyRoute: admin branch ============ */
rep(`  if(h==='policy'){loginEl.classList.add('hide');appEl.classList.add('hide');obEl.classList.add('hide');polEl.classList.remove('hide');renderPolicy();window.scrollTo(0,0);return;}`,
`  if(h==='policy'){loginEl.classList.add('hide');appEl.classList.add('hide');obEl.classList.add('hide');polEl.classList.remove('hide');renderPolicy();window.scrollTo(0,0);return;}
  if(h==='admin'){loginEl.classList.add('hide');appEl.classList.add('hide');obEl.classList.add('hide');polEl.classList.add('hide');\$('#view-admin').classList.remove('hide');renderAdminView();window.scrollTo(0,0);return;}`, 'applyRoute admin');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v08 part1 OK');
process.exit(missing.length ? 1 : 0);

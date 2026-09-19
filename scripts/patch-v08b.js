// v0.8 patch B (viết lại sạch): dùng replacer function để không bị nuốt $$.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);           // replacer function → $ trong b giữ nguyên
}
function repAll(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.split(a).join(b);              // split/join → literal
}

/* 1. openModal edit branch: sửa $$( → đúng, dùng kf thay f */
rep(`  if(opts.edit){
    editingKeoId=opts.edit;
    const p=allKeo().find(x=>String(x.id)===String(opts.edit));
    if(p){
      f.rcat.value=p.cat;f.fname.value=p.title;f.fdesc.value=p.desc||'';
      f.fplace.value=p.place;f.fDistrict.value=p.district;
      f.fdate.value=p.date||'';f.ftime.value=p.time||'';f.fnum.value=p.total;
      f.fexp.value=String(p.expHours!=null?p.expHours:24);
      f.rpay.value=p.pay||'Chia đều hóa đơn';
      $('#vibeChips input').forEach(i=>{i.checked=(p.vibes||[]).includes(i.value);i.disabled=false;});
      $('#mtitle').textContent='SỬA KÈO';
      if(p.partner){const pt=partnerById(p.partner);if(pt){prefillPartner=pt;$('#partnerHint').classList.remove('hide');$('#partnerHint').textContent='Quán đối tác: '+pt.promo;}}
    }
  }else{`,
`  if(opts.edit){
    editingKeoId=opts.edit;
    const p=allKeo().find(x=>String(x.id)===String(opts.edit));
    const kf=$('#kform');
    if(p){
      kf.rcat.value=p.cat;kf.fname.value=p.title;kf.fdesc.value=p.desc||'';
      kf.fplace.value=p.place;kf.fDistrict.value=p.district;
      kf.fdate.value=p.date||'';kf.ftime.value=p.time||'';kf.fnum.value=p.total;
      kf.fexp.value=String(p.expHours!=null?p.expHours:24);
      kf.rpay.value=p.pay||'Chia đều hóa đơn';
      $$('#vibeChips input').forEach(i=>{i.checked=(p.vibes||[]).includes(i.value);i.disabled=false;});
      $('#mtitle').textContent='SỬA KÈO';
      if(p.partner){const pt=partnerById(p.partner);if(pt){prefillPartner=pt;$('#partnerHint').classList.remove('hide');$('#partnerHint').textContent='Quán đối tác: '+pt.promo;}}
    }
  }else{`, 'openModal edit kf');

/* 2. coverStyle quán theo partnerCat */
repAll(`coverStyle(pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags[0]==='Bia craft'?'Nhậu':'Đá banh')`,
`coverStyle(partnerCat(pt))`, 'coverStyle partnerCat');

/* 3. ADMIN JS */
rep(`/* ================= ROUTING ================= */`,
`/* ================= ADMIN PANEL ================= */
let aTab='overview',aKeys='';
function renderAdminView(){
  const loginBox=$('#adminLogin'),panel=$('#adminPanel');
  if(!adminS){panel.classList.add('hide');loginBox.classList.remove('hide');return;}
  loginBox.classList.add('hide');panel.classList.remove('hide');
  $$('#atabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.at===aTab));
  renderAdminBody();
}
function keoStatus(p){
  if(isExpired(p))return['Đã ẩn','st-hid'];
  const w=whenInfo(p);
  if(w.past)return['Đã diễn ra','st-past'];
  if(w.ongoing)return['Đang diễn ra','st-open'];
  return['Sắp diễn ra','st-open'];
}
function renderAdminBody(){
  const body=$('#adminBody');
  if(aTab==='overview'){
    const K=allKeo();
    const open=K.filter(p=>!isExpired(p)&&!whenInfo(p).past).length;
    const late=K.filter(p=>isLate(p)&&!whenInfo(p).past).length;
    const hosts=new Set(K.filter(p=>p.joined[0]).map(p=>p.joined[0].uid)).size;
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Quản trị</div><h2>Tổng quan</h2></div>
      <div class="ctl"><span class="mbadge \${MODE==='cloud'?'mcld':'mloc'}" style="cursor:default">\${MODE==='cloud'?'☁️ Cloud':'💾 Local'}\${cloudConnecting?' — đang kết nối…':''}</span></div></div>
      <div class="astats">
        <div class="astat"><b>\${K.length}</b><span>Tổng kèo</span></div>
        <div class="astat"><b>\${open}</b><span>Đang mở</span></div>
        <div class="astat"><b>\${late}</b><span>Kèo khuya (22h+)</span></div>
        <div class="astat"><b>\${hosts}</b><span>Chủ kèo</span></div>
        <div class="astat"><b>\${PARTNERS.length}</b><span>Quán đối tác</span></div>
        <div class="astat"><b>\${VREQ.length}</b><span>Yêu cầu của quán</span></div>
      </div>
      <div class="acard"><h3>Thao tác nhanh</h3>
        <a class="btn btn-sm" style="text-decoration:none" href="#discover">← Về bảng tin</a>
        <button class="abtn danger" data-act="clearkeo" type="button" style="margin-left:8px">Xoá toàn bộ kèo</button>
      </div>\`;
  }else if(aTab==='keos'){
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Quản trị</div><h2>Quản lý kèo</h2></div>
      <div class="ctl"><input id="akeys" placeholder="Tìm theo tên / địa điểm…" style="border:1.5px solid var(--line2);border-radius:12px;padding:9px 14px;font:500 14px 'Be Vietnam Pro',sans-serif;outline:none;min-width:240px" value="\${esc(aKeys)}"></div></div>
      <div class="acard" style="padding:0;overflow:hidden"><div class="atwrap"><table class="atable" id="akeosTable"></table></div></div>
      <p class="crt-soon">Sửa kèo mở khung chỉnh sửa đầy đủ (món, địa điểm, giờ, số chỗ, tự ẩn…). Xoá kèo cần xác nhận. Lưu ý cloud: sửa/xoá kèo của người khác cần quyền admin trên server (custom claim).</p>\`;
    renderKeosTable();
  }else if(aTab==='venues'){
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Đối tác</div><h2>Quán đối tác (\${PARTNERS.length})</h2></div>
      <div class="ctl"><button class="btn btn-p btn-sm" data-act="vadd" type="button">＋ Thêm quán</button></div></div>
      <div class="agrid">\${PARTNERS.map(pt=>\`
        <div class="acard" style="margin-bottom:0">
          <h3>\${partnerEmoji(pt)} \${esc(pt.name)}</h3>
          <div style="font-size:12.5px;color:var(--mut);margin:2px 0 6px">\${esc(pt.district)} · \${pt.tags.map(esc).join(' · ')}</div>
          <div class="vpromo">\${esc(pt.promo)}</div>
          <div style="font-size:12.5px;color:var(--mut);margin:6px 0 10px">\${esc(pt.note)}</div>
          <div style="display:flex;gap:8px"><button class="abtn" data-act="vedit" data-id="\${pt.id}" type="button">Sửa</button>
          <button class="abtn danger" data-act="vdel" data-id="\${pt.id}" type="button">Xoá</button></div>
        </div>\`).join('')}</div>\`;
  }else if(aTab==='requests'){
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Đối tác</div><h2>Yêu cầu của quán (\${VREQ.length})</h2></div></div>
      \${VREQ.length?\`<div class="acard" style="padding:0;overflow:hidden"><div class="atwrap"><table class="atable">
        <tr><th>Quán</th><th>Quận</th><th>Liên hệ</th><th>Giờ vàng</th><th>Lời nhắn</th><th></th></tr>
        \${VREQ.map(v=>\`<tr><td class="atitle">\${esc(v.name)}</td><td>\${esc(v.district)}</td><td>\${esc(v.phone)}</td><td>\${esc(v.time||'—')}</td><td>\${esc(v.msg||'—')}</td>
        <td><button class="abtn danger" data-act="rdel" data-id="\${v.at}" type="button">Xoá</button></td></tr>\`).join('')}
      </table></div></div>\`:\`<div class="empty"><p>Chưa có yêu cầu nào</p><small>Form "Quán của bạn muốn lên đề xuất?" ở tab Quán liên kết sẽ đẩy yêu cầu về đây.</small></div>\`}\`;
  }else{
    body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">Quản trị</div><h2>Cài đặt</h2></div></div>
      <div class="acard aset" style="max-width:480px"><h3>Đổi mật khẩu quản trị</h3>
        <form id="passForm">
          <label class="flab" for="pCur">Mật khẩu hiện tại</label><input type="password" id="pCur" required>
          <label class="flab" for="pNew">Mật khẩu mới <small>(tối thiểu 6 ký tự)</small></label><input type="password" id="pNew" required minlength="6">
          <button class="btn btn-p btn-sm" type="submit" style="margin-top:12px">Đổi mật khẩu</button>
        </form></div>
      <div class="acard" style="max-width:480px"><h3>Phiên quản trị</h3>
        <p style="font-size:13px;color:var(--mut);margin:0 0 10px">Đang đăng nhập quản trị viên. Thoát sẽ quay về màn đăng nhập quản trị (kèo và dữ liệu giữ nguyên).</p>
        <button class="abtn" data-act="admlogout" type="button">Đăng xuất quản trị</button></div>
      <div class="acard" style="max-width:480px"><h3>Dữ liệu</h3>
        <p style="font-size:13px;color:var(--mut);margin:0 0 10px">Xoá toàn bộ kèo của mọi người — cần xác nhận. Cloud cần quyền admin server.</p>
        <button class="abtn danger" data-act="clearkeo" type="button">Xoá toàn bộ kèo</button></div>\`;
  }
}
function renderKeosTable(){
  const q=aKeys.trim().toLowerCase();
  const K=allKeo().filter(p=>!q||(p.title+' '+p.place).toLowerCase().includes(q));
  $('#akeosTable').innerHTML=\`<tr><th>Món</th><th>Tên kèo</th><th>Quận</th><th>Thời gian</th><th>Chỗ</th><th>Trạng thái</th><th>Tuỳ chọn</th></tr>\`+
    (K.length?K.map(p=>{const st=keoStatus(p),w=whenInfo(p);return \`<tr>
      <td>\${CATS[p.cat].e}</td>
      <td class="atitle">\${esc(p.title)}</td>
      <td>\${esc(p.district)}</td>
      <td>\${esc(w.day)}</td>
      <td>\${p.joined.length}/\${p.total}</td>
      <td><span class="chipst \${st[1]}">\${st[0]}</span></td>
      <td style="white-space:nowrap"><button class="abtn" data-act="aedit" data-id="\${p.id}" type="button">Sửa</button>
      <button class="abtn danger" data-act="adel" data-id="\${p.id}" type="button">Xoá</button></td></tr>\`;}).join('')
    :\`<tr><td colspan="7" style="text-align:center;color:var(--mut);padding:20px">Không có kèo nào.</td></tr>\`);
}
$('#atabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;aTab=t.dataset.at;renderAdminView();});
$('#admLoginBtn').addEventListener('click',()=>{
  if(hashStr($('#admPass').value)===adminPass){
    adminS={role:'admin',name:'Lê Hoàng Vũ',at:Date.now()};save('keode.admin.v1',adminS);
    $('#admPass').value='';$('#admErr').classList.add('hide');
    renderAdminView();toast('Chào quản trị viên!');
  }else{$('#admErr').classList.remove('hide');}
});
$('#admPass').addEventListener('keydown',e=>{if(e.key==='Enter')$('#admLoginBtn').click();});
$('#admExit').addEventListener('click',()=>{adminS=null;localStorage.removeItem('keode.admin.v1');renderAdminView();});
$('#adminBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,id=b.dataset.id;
  if(act==='aedit')openModal({edit:id});
  else if(act==='adel'){if(confirm('Xoá kèo này? Hành động không thể hoàn tác.'))adminDeleteKeo(id);}
  else if(act==='vadd')openVenueModal();
  else if(act==='vedit')openVenueModal(id);
  else if(act==='vdel'){if(confirm('Xoá quán đối tác này?')){PARTNERS=PARTNERS.filter(x=>x.id!==id);savePartners();renderAdminBody();renderPartnerStrip();renderVenues();toast('Đã xoá quán.');}}
  else if(act==='rdel'){VREQ=VREQ.filter(x=>String(x.at)!==String(id));save('keode.venueReq.v1',VREQ);renderAdminBody();renderVenues();}
  else if(act==='admlogout'){adminS=null;localStorage.removeItem('keode.admin.v1');renderAdminView();toast('Đã đăng xuất quản trị.');}
  else if(act==='clearkeo'){
    if(!confirm('XOÁ TOÀN BỘ KÈO của mọi người? Không thể hoàn tác.'))return;
    if(MODE==='cloud'&&db){CLOUD_KEO.forEach(p=>db.collection('keos').doc(String(p.id)).delete().catch(()=>{}));toast('Đang xoá trên cloud…');}
    else{KEO=[];save('keode.posts.v2',KEO);closeRadarPop();renderAll();renderAdminBody();toast('Đã xoá toàn bộ kèo.');}
  }
});
$('#adminBody').addEventListener('input',e=>{if(e.target.id==='akeys'){aKeys=e.target.value;renderKeosTable();}});
$('#adminBody').addEventListener('submit',e=>{
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
});
let editingVenueId=null;
function openVenueModal(id){
  editingVenueId=id||null;
  $('#vEdistrict').innerHTML=DISTRICTS.filter(x=>x!=='Khu vực khác').map(x=>\`<option>\${x}</option>\`).join('');
  $('#vEcat').innerHTML=CAT_LIST.map(c=>\`<option>\${c}</option>\`).join('');
  const pt=id?PARTNERS.find(x=>x.id===id):null;
  $('#vmodalTitle').textContent=pt?'SỬA QUÁN: '+pt.name:'Thêm quán đối tác';
  $('#vEname').value=pt?pt.name:'';$('#vEdistrict').value=pt?pt.district:'Quận 1';
  $('#vEemoji').value=pt?(pt.emoji||'☕'):'☕';$('#vEcat').value=pt?partnerCat(pt):'Cà phê';
  $('#vEtags').value=pt?pt.tags.join(', '):'';$('#vEpromo').value=pt?pt.promo:'';$('#vEnote').value=pt?pt.note:'';
  $('#venueOverlay').classList.remove('hide');
}
function closeVenueModal(){$('#venueOverlay').classList.add('hide');editingVenueId=null;}
$('#vmodalClose').addEventListener('click',closeVenueModal);
$('#vECancel').addEventListener('click',closeVenueModal);
$('#venueOverlay').addEventListener('click',e=>{if(e.target===venueOverlay)closeVenueModal();});
async function adminDeleteKeo(id){
  const p=allKeo().find(x=>String(x.id)===String(id));if(!p)return;
  if(MODE==='cloud'&&db){
    try{await db.collection('keos').doc(String(id)).delete();}
    catch(err){toast('Lỗi cloud (cần quyền admin server): '+err.message);return;}
    renderAdminBody();renderFeed();
  }else{
    KEO=KEO.filter(x=>String(x.id)!==String(id));
    save('keode.posts.v2',KEO);renderAll();renderAdminBody();
  }
  toast('Đã xoá kèo.');
}

/* ================= ROUTING ================= */`, 'admin js');

/* 4. version bump */
rep(`KÈO ĐÊ — v0.7 "COKEO-STYLE + CLOUD"`, `KÈO ĐÊ — v0.8 "ADMIN PANEL"`, 'head version');
rep(`(prototype v0.7 · chỉ TP. Hồ Chí Minh)`, `(prototype v0.8 · chỉ TP. Hồ Chí Minh)`, 'footer version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v08 part2 OK');
process.exit(missing.length ? 1 : 0);

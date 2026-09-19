// v0.9.5: (1) Kèo Du lịch → Xuất phát tại/Điểm đến/Ngày-Giờ khởi hành thay Quận;
//         (2) Đổi 'Đá banh' → 'Thể thao' toàn web + chuẩn hoá dữ liệu cũ.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* ============ 1. HTML modal: bọc khối địa điểm/quận + thêm khối du lịch + nhãn động ============ */
rep(`      <label class="flab" for="fplace">Địa điểm <small>(gõ tên quán — có gợi ý quán đối tác)</small></label>
      <input id="fplace" name="fplace" required maxlength="120" list="partnerList" placeholder="vd: Cộng Cà Phê Nguyễn Du">
      <datalist id="partnerList"></datalist>
      <div id="partnerHint" class="partnerhint hide"></div>
      <label class="flab" for="fDistrict">Quận</label>
      <select id="fDistrict"></select>
      <div class="f3">
        <div><label class="flab" for="fdate">Ngày</label><input type="date" id="fdate" required></div>
        <div><label class="flab" for="ftime">Giờ</label><input type="time" id="ftime" required></div>
        <div><label class="flab" for="fnum">Cần bao nhiêu người</label><input type="number" id="fnum" min="2" max="20" value="6"></div>
      </div>`,
`      <div id="fLocNormal">
        <label class="flab" for="fplace">Địa điểm <small>(gõ tên quán — có gợi ý quán đối tác)</small></label>
        <input id="fplace" name="fplace" required maxlength="120" list="partnerList" placeholder="vd: Cộng Cà Phê Nguyễn Du">
        <datalist id="partnerList"></datalist>
        <div id="partnerHint" class="partnerhint hide"></div>
        <label class="flab" for="fDistrict">Quận</label>
        <select id="fDistrict"></select>
      </div>
      <div id="fTravel" class="hide">
        <label class="flab" for="fFrom">Xuất phát tại</label>
        <input id="fFrom" maxlength="120" placeholder="vd: Siêu thị Co.opmart Thủ Đức">
        <label class="flab" for="fTo">Điểm đến</label>
        <input id="fTo" maxlength="120" placeholder="vd: Vũng Tàu / Đà Lạt">
      </div>
      <div class="f3">
        <div><label class="flab" for="fdate" id="fdateLabel">Ngày</label><input type="date" id="fdate" required></div>
        <div><label class="flab" for="ftime" id="ftimeLabel">Giờ</label><input type="time" id="ftime" required></div>
        <div><label class="flab" for="fnum">Cần bao nhiêu người</label><input type="number" id="fnum" min="2" max="20" value="6"></div>
      </div>`, 'modal travel fields');

/* ============ 2. CSS nhỏ cho nhãn ============ */
rep(`.partnerhint{background:var(--amber-t);`,
`.partnerhint{background:var(--amber-t);`, 'noop keep');

/* ============ 3. JS: CATS + ICONS đổi tên ============ */
rep(`  'Đá banh':{c:'#A8E88E',e:'⚽'}`, `  'Thể thao':{c:'#A8E88E',e:'⚽'}`, 'CATS rename');
rep(`  'Đá banh':[[2,0,4,1],[1,1,1,1],[6,1,1,1],[0,2,1,1],[7,2,1,1],[0,3,1,2],[7,3,1,2],[0,5,1,1],[7,5,1,1],[1,6,1,1],[6,6,1,1],[2,7,4,1],[3,3,2,2],[3,1,2,1],[1,3,1,2],[6,3,1,2],[3,6,2,1]]`,
`  'Thể thao':[[2,0,4,1],[1,1,1,1],[6,1,1,1],[0,2,1,1],[7,2,1,1],[0,3,1,2],[7,3,1,2],[0,5,1,1],[7,5,1,1],[1,6,1,1],[6,6,1,1],[2,7,4,1],[3,3,2,2],[3,1,2,1],[1,3,1,2],[6,3,1,2],[3,6,2,1]]`, 'ICONS rename');

/* ============ 4. chuẩn hoá danh mục cũ (Đá banh → Thể thao) ============ */
rep(`const nextId=()=>Date.now()+Math.floor(Math.random()*999);`,
`const nextId=()=>Date.now()+Math.floor(Math.random()*999);
const normCat=c=>c==='Đá banh'?'Thể thao':c;`, 'normCat');

/* local KEO load: map cat */
rep(`let KEO=load('keode.posts.v2',[]);
if(!Array.isArray(KEO))KEO=[];`,
`let KEO=load('keode.posts.v2',[]);
if(!Array.isArray(KEO))KEO=[];
KEO=KEO.map(p=>Object.assign({},p,{cat:normCat(p.cat)}));`, 'local KEO norm');

/* cloud snapshot: map cat */
rep(`      CLOUD_KEO=snap.docs.map(d=>Object.assign({id:d.id},d.data()));`,
`      CLOUD_KEO=snap.docs.map(d=>{const o=Object.assign({id:d.id},d.data());o.cat=normCat(o.cat);return o;});`, 'cloud KEO norm');

/* ============ 5. seed quán Sân Cỏ: tag Thể thao + partnerCat ============ */
rep(`{id:'p3',name:'Sân Cỏ Đề Phòng',district:'Gò Vấp',tags:['Đá banh','Sân 5']`,
`{id:'p3',name:'Sân Cỏ Đề Phòng',district:'Gò Vấp',tags:['Thể thao','Sân 5']`, 'seed p3 tags');
rep(`const partnerCat=pt=>pt.tags&&pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags&&pt.tags[0]==='Bia craft'?'Nhậu':'Đá banh';`,
`const partnerCat=pt=>pt.tags&&pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags&&pt.tags[0]==='Bia craft'?'Nhậu':'Thể thao';`, 'partnerCat');

/* ============ 6. login cats-line: Thể thao ============ */
rep(`Cà phê · Ăn uống · Xem phim · Nhậu · Đá banh · Du lịch · Karaoke`,
`Cà phê · Ăn uống · Xem phim · Nhậu · Thể thao · Du lịch · Karaoke`, 'login cats');

/* ============ 7. updateTravelMode + listener ============ */
rep(`$('#vibeChips').addEventListener('change',()=>{`,
`function updateTravelMode(){
  const isTravel=(document.querySelector('input[name="rcat"]:checked')||{}).value==='Du lịch';
  $('#fLocNormal').classList.toggle('hide',isTravel);
  $('#fTravel').classList.toggle('hide',!isTravel);
  $('#fFrom').required=isTravel;
  $('#fTo').required=isTravel;
  $('#fplace').required=!isTravel;
  $('#fdateLabel').textContent=isTravel?'Ngày khởi hành':'Ngày';
  $('#ftimeLabel').textContent=isTravel?'Giờ khởi hành':'Giờ';
}
$('#catRadios').addEventListener('change',updateTravelMode);
$('#vibeChips').addEventListener('change',()=>{`, 'updateTravelMode');

/* openModal/edit gọi updateTravelMode sau khi set radio */
rep(`  $('#overlay').classList.remove('hide');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('#fname').focus(),30);
}`,
`  updateTravelMode();
  $('#overlay').classList.remove('hide');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('#fname').focus(),30);
}`, 'openModal travel toggle');

/* edit prefill: from/to */
rep(`      kf.fdate.value=p.date||'';kf.ftime.value=p.time||'';kf.fnum.value=p.total;
      kf.fexp.value=String(p.expHours!=null?p.expHours:24);`,
`      kf.fdate.value=p.date||'';kf.ftime.value=p.time||'';kf.fnum.value=p.total;
      kf.fFrom.value=p.from||'';kf.fTo.value=p.to||'';
      kf.fexp.value=String(p.expHours!=null?p.expHours:24);`, 'edit prefill from/to');

/* ============ 8. submit: nhánh Du lịch ============ */
rep(`  const base={cat:f.rcat.value,title:f.fname.value.trim(),desc:f.fdesc.value.trim(),
    vibes,place:f.fplace.value.trim(),district:f.fDistrict.value,
    date:f.fdate.value,time:f.ftime.value,total:Math.min(20,Math.max(2,+f.fnum.value||6)),
    pay:f.rpay.value,partner:prefillPartner?prefillPartner.id:null,
    expiresAt,created:Date.now()};`,
`  const isTravel=f.rcat.value==='Du lịch';
  const from=isTravel?f.fFrom.value.trim():'';
  const to=isTravel?f.fTo.value.trim():'';
  const base={cat:f.rcat.value,title:f.fname.value.trim(),desc:f.fdesc.value.trim(),
    vibes,place:isTravel?from+' → '+to:f.fplace.value.trim(),
    district:isTravel?'Du lịch':f.fDistrict.value,
    from,to,
    date:f.fdate.value,time:f.ftime.value,total:Math.min(20,Math.max(2,+f.fnum.value||6)),
    pay:f.rpay.value,partner:prefillPartner?prefillPartner.id:null,
    expiresAt,created:Date.now()};`, 'submit travel');

/* ============ 9. cardHTML: dòng địa điểm du lịch ============ */
rep(`      <div class="kmeta"><svg class="pinic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(p.place)} · \${esc(p.district)}</span></div>`,
`      \${p.cat==='Du lịch'&&p.from
        ?\`<div class="kmeta"><span>🚗 \${esc(p.from)} → \${esc(p.to||'')}</span></div>\`
        :\`<div class="kmeta"><svg class="pinic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(p.place)} · \${esc(p.district)}</span></div>\`}`, 'card travel meta');

/* chip quận: kèo du lịch bỏ chip quận */
rep(`    \`<span class="ctag">\${esc(p.district)}</span>\`,
    partner?`,
`    \${p.district==='Du lịch'?'':\`<span class="ctag">\${esc(p.district)}</span>\`},
    partner?`, 'card chip skip');

/* ============ 10. detailHTML: du lịch ============ */
rep(`        <div class="drow"><span class="dico">📍</span>
          <div><b>\${esc(p.place)}</b><small>\${esc(p.district)} · TP. Hồ Chí Minh</small>
          <a class="btn btn-sm" style="margin-top:8px;text-decoration:none" href="https://www.google.com/maps/search/?api=1&query=\${mapsQ}" target="_blank" rel="noopener">Mở Google Maps ↗</a></div></div>`,
`        <div class="drow"><span class="dico">📍</span>
          <div>\${p.cat==='Du lịch'&&p.from
            ?\`<b>Xuất phát: \${esc(p.from)}</b><small>Điểm đến: \${esc(p.to||'')}</small>\`
            :\`<b>\${esc(p.place)}</b><small>\${esc(p.district)} · TP. Hồ Chí Minh</small>\`}
          <a class="btn btn-sm" style="margin-top:8px;text-decoration:none" href="https://www.google.com/maps/search/?api=1&query=\${mapsQ}" target="_blank" rel="noopener">Mở Google Maps ↗</a></div></div>`, 'detail travel place');

/* maps query cho du lịch: from to */
rep(`  const mapsQ=encodeURIComponent(p.place+' '+p.district+' TP. Hồ Chí Minh');`,
`  const mapsQ=encodeURIComponent((p.cat==='Du lịch'&&p.from)?(p.from+' đến '+p.to):(p.place+' '+p.district+' TP. Hồ Chí Minh'));`, 'maps travel query');

/* chips trong cover: bỏ chip quận du lịch */
rep(`      <span class="ctag">\${p.cat}</span><span class="ctag">\${esc(p.district)}</span>`,
`      <span class="ctag">\${p.cat}</span>\${p.district==='Du lịch'?'':'<span class="ctag">'+esc(p.district)+'</span>'}`, 'detail chips skip');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v095 OK');
process.exit(missing.length ? 1 : 0);

// v0.9.1 — Quán đối tác: link Google Maps từng quán + địa chỉ tuỳ chọn (admin nhập).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. helper tạo query Google Maps */
rep(`const partnerCat=pt=>pt.tags&&pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags&&pt.tags[0]==='Bia craft'?'Nhậu':'Đá banh';`,
`const partnerCat=pt=>pt.tags&&pt.tags[0]==='Cà phê đặc sản'?'Cà phê':pt.tags&&pt.tags[0]==='Bia craft'?'Nhậu':'Đá banh';
function mapsQuery(pt){return encodeURIComponent(((pt.addr)?pt.addr+' — ':'')+pt.name+' '+pt.district+' TP. Hồ Chí Minh');}`, 'mapsQuery');

/* 2. Trang Quán liên kết: thêm link Maps + hiện địa chỉ */
rep(`        <div class="vpromo">\${esc(pt.promo)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center"><span class="vbadge" style="background:var(--line)">đối tác mẫu</span>`,
`        <div class="vpromo">\${esc(pt.promo)}</div>
        \${pt.addr?'<div style="font-size:12.5px;color:var(--navy)">📍 '+esc(pt.addr)+'</div>':''}
        <a class="linklike" style="font-size:13px;display:inline-block;margin-bottom:8px" href="https://www.google.com/maps/search/?api=1&query=\${mapsQuery(pt)}" target="_blank" rel="noopener">📍 Xem quán trên Google Maps ↗</a>
        <div style="display:flex;justify-content:space-between;align-items:center"><span class="vbadge" style="background:var(--line)">đối tác mẫu</span>`, 'venues maps');

/* 3. Partner strip (trang chủ): thêm chỉ đường — chuỗi đơn nối \n để né escape */
const a3 = '      <div class="promo">${esc(pt.promo)}</div>\n' +
           '      <button type="button" class="btn btn-p btn-sm" data-pbook="${pt.id}" style="width:100%">Tạo kèo ở quán này</button></div>`).join(\'\');`';
const b3 = '      <div class="promo">${esc(pt.promo)}</div>\n' +
           '      <a class="linklike" style="font-size:12px;display:inline-block;margin-bottom:9px" href="https://www.google.com/maps/search/?api=1&query=${mapsQuery(pt)}" target="_blank" rel="noopener">📍 Chỉ đường tới quán ↗</a>\n' +
           '      <button type="button" class="btn btn-p btn-sm" data-pbook="${pt.id}" style="width:100%">Tạo kèo ở quán này</button></div>`).join(\'\');`';
rep(a3, b3, 'strip maps');

/* 4. Admin venue modal: thêm ô địa chỉ */
rep(`      <label class="flab" for="vEtags">Thẻ <small>(phải cách nhau dấu phẩy)</small></label>`,
`      <label class="flab" for="vEaddr">Địa chỉ <small>(tuỳ chọn — giúp khách tìm đúng quán)</small></label>
      <input id="vEaddr" maxlength="140" placeholder="vd: 12 Nguyễn Huệ, Quận 1">
      <label class="flab" for="vEtags">Thẻ <small>(phải cách nhau dấu phẩy)</small></label>`, 'addr input');

/* 5. openVenueModal: prefill addr */
rep(`  \$('#vEtags').value=pt?pt.tags.join(', '):'';\$('#vEpromo').value=pt?pt.promo:'';\$('#vEnote').value=pt?pt.note:'';`,
`  \$('#vEaddr').value=pt?(pt.addr||''):'';
  \$('#vEtags').value=pt?pt.tags.join(', '):'';\$('#vEpromo').value=pt?pt.promo:'';\$('#vEnote').value=pt?pt.note:'';`, 'prefill addr');

/* 6. veForm save: lưu addr */
rep(`      tags:\$('#vEtags').value.split(',').map(x=>x.trim()).filter(Boolean),promo:\$('#vEpromo').value.trim(),note:\$('#vEnote').value.trim()};`,
`      tags:\$('#vEtags').value.split(',').map(x=>x.trim()).filter(Boolean),addr:\$('#vEaddr').value.trim(),promo:\$('#vEpromo').value.trim(),note:\$('#vEnote').value.trim()};`, 'save addr');

/* 7. Admin venues card: hiện địa chỉ */
rep(`          <div style="font-size:12.5px;color:var(--mut);margin:6px 0 10px">\${esc(pt.note)}</div>`,
`          <div style="font-size:12.5px;color:var(--mut);margin:6px 0 10px">\${pt.addr?'📍 '+esc(pt.addr)+' · ':''}\${esc(pt.note)}</div>`, 'admin addr');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v092 OK');
process.exit(missing.length ? 1 : 0);

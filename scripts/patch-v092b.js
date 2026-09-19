// v0.9.1 hoàn tất: strip maps + save addr (anchor khớp file thật).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. Partner strip: chèn link Maps giữa promo và button */
rep('      <div class="promo">${esc(pt.promo)}</div>\n' +
    '      <button type="button" class="btn btn-p btn-sm" data-pbook="${pt.id}" style="width:100%">Tạo kèo ở quán này</button>\n',
'      <div class="promo">${esc(pt.promo)}</div>\n' +
    '      <a class="linklike" style="font-size:12px;display:inline-block;margin-bottom:9px" href="https://www.google.com/maps/search/?api=1&query=${mapsQuery(pt)}" target="_blank" rel="noopener">📍 Chỉ đường tới quán ↗</a>\n' +
    '      <button type="button" class="btn btn-p btn-sm" data-pbook="${pt.id}" style="width:100%">Tạo kèo ở quán này</button>\n', 'strip maps');

/* 2. veForm: lưu addr */
rep('    tags:$(\'#vEtags\').value.split(\',\').map(x=>x.trim()).filter(Boolean),promo:$(\'#vEpromo\').value.trim(),note:$(\'#vEnote\').value.trim()};',
'    tags:$(\'#vEtags\').value.split(\',\').map(x=>x.trim()).filter(Boolean),addr:$(\'#vEaddr\').value.trim(),promo:$(\'#vEpromo\').value.trim(),note:$(\'#vEnote\').value.trim()};', 'save addr');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v092b OK');
process.exit(missing.length ? 1 : 0);

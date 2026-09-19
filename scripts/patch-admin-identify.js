// Admin nhận diện rõ: app gắn UID admin + menu hiện badge 🛡 ADMIN và UID tài khoản.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. ADMIN_UID cố định trong app + isAdmin theo UID (bỏ so theo tên — dễ trùng) */
rep(`const ADMIN_NAMES=['Lê Hoàng Vũ']; // production: dùng custom claim admin trên Firebase, không so tên`,
`const ADMIN_UID='mFbMQbKE5jhCR83aYBbSknoHdT42'; // UID admin trong rules — khớp mới có quyền toàn quyền cloud`, 'admin uid const');

rep(`function isAdmin(){return !!(adminS&&adminS.role==='admin')||!!(profile&&ADMIN_NAMES.includes(profile.name));}`,
`function isAdmin(){return !!(adminS&&adminS.role==='admin')||!!(session&&session.id===ADMIN_UID);}`, 'isAdmin uid');

/* 2. User menu: badge admin + UID hiển thị */
rep(`    m.innerHTML=\`<div class="uprov">Đăng nhập bằng \${esc((session&&session.provider)||'?')}</div>
      <div class="umail"><b>\${esc(session?session.name:'')}</b><br>\${esc(session&&session.email||'không có email (demo)')}</div>
      <button class="btn" type="button" id="kycMenuBtn" style="color:var(--navy)">🪪 Xác minh danh tính</button>
      <button class="btn" type="button" id="logoutBtn">Đăng xuất</button>\`;`,
`    m.innerHTML=\`<div class="uprov">Đăng nhập bằng \${esc((session&&session.provider)||'?')}</div>
      <div class="umail"><b>\${esc(session?session.name:'')}</b><br>\${esc(session&&session.email||'không có email (demo)')}</div>
      \${isAdmin()?'<div class="gold" style="margin:6px 0 2px">🛡 TÀI KHOẢN ADMIN</div>':'<div style="font-size:11px;color:var(--mut);padding:2px 4px">Tài khoản thường</div>'}
      <div style="font-size:10.5px;color:var(--mut);padding:2px 4px;word-break:break-all">UID: \${esc((session&&session.id)||'')}</div>
      <button class="btn" type="button" id="kycMenuBtn" style="color:var(--navy)">🪪 Xác minh danh tính</button>
      <button class="btn" type="button" id="logoutBtn">Đăng xuất</button>\`;`, 'usermenu admin badge');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'admin identify OK');
process.exit(missing.length ? 1 : 0);

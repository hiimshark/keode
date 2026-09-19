// v0.9.3: ẩn thông điệp kỹ thuật + link Quản trị khỏi giao diện khách; gắn UID admin vào rules.
const fs = require('fs');
const missing = [];

/* 1. keo-de.html */
let h = fs.readFileSync('keo-de.html', 'utf8');
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1a. gỡ dòng status khỏi login card */
rep(`      <p id="cfgStatus" class="cfgstat" style="margin:10px 0 0"></p>\n`, '', 'cfgStatus p');
rep(`        <a class="linklike" href="#admin" style="color:var(--mut)">Quản trị</a>\n`, '', 'login admin link');
rep(`    <a href="#admin" style="color:var(--mut);text-decoration:none">Quản trị</a>`, '', 'footer admin link');

/* 1b. renderLoginAuth: không đụng status nữa, panel tự ẩn khi có config */
rep(`function renderLoginAuth(){
  const st=\$('#cfgStatus');
  if(st)st.innerHTML=fbValid(FB)
    ?'<span class="okb">✓ Đăng nhập Google/Facebook thật đã bật</span> <span style="color:var(--mut)">— người dùng chỉ cần bấm nút và chọn tài khoản</span>'
    :'<span class="nob">Chưa bật đăng nhập thật</span> — bấm ⚙️ bên dưới để cấu hình 1 lần (5 phút).';
  if(fbValid(FB)){}
}`,
`function renderLoginAuth(){
  if(fbValid(FB)){}
}`, 'renderLoginAuth');

/* fallback: nếu bản renderLoginAuth hiện tại khác (đã đổi chữ Google) */
if (h.includes(`  const st=\$('#cfgStatus');`)) {
  const s = h.indexOf(`  const st=\$('#cfgStatus');`);
  const e = h.indexOf(`  if(fbValid(FB))`, s);
  if (e > s) h = h.slice(0, s) + h.slice(e);
  missing.push('(fallback applied) renderLoginAuth đã lược gọn');
}

fs.writeFileSync('keo-de.html', h);

/* 2. firestore.rules: gắn UID admin thật */
let r = fs.readFileSync('firestore.rules', 'utf8');
if (r.includes('DÁN_UID_ADMIN_VÀO_ĐÂY')) {
  r = r.replace("'DÁN_UID_ADMIN_VÀO_ĐÂY'", "'mFbMQbKE5jhCR83aYBbSknoHdT42'");
  fs.writeFileSync('firestore.rules', r);
  console.log('UID admin đã gắn vào firestore.rules');
} else if (r.includes('mFbMQbKE5jhCR83aYBbSknoHdT42')) {
  console.log('UID đã có sẵn trong rules');
} else { missing.push('rules uid'); }

console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v093 OK');
process.exit(missing.length ? 1 : 0);

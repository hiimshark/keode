// Xoá đăng nhập Facebook (nút + logic + chữ) theo yêu cầu user.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];

/* 1. HTML: gỡ nút Facebook (dùng indexOf vì SVG dài) */
const bStart = h.indexOf('        <button id="fbBtn" class="btn btn-oauth" type="button">');
const bEnd = h.indexOf('</button>', bStart);
if (bStart < 0 || bEnd < 0) missing.push('fbBtn html');
else h = h.slice(0, bStart) + h.slice(bEnd + 9);

/* 2. JS: gỡ loginFacebook() */
const fStart = h.indexOf('async function loginFacebook(){');
const fEnd = h.indexOf('\nfunction handleAuthErr', fStart);
if (fStart < 0 || fEnd < 0) missing.push('loginFacebook fn');
else h = h.slice(0, fStart) + h.slice(fEnd + 1);

/* 3. JS: gỡ handler nút FB */
rep = (a) => {
  if (!h.includes(a)) { missing.push('fbBtn handler'); return; }
  h = h.replace(a, '');
};
rep(`$('#fbBtn').addEventListener('click',()=>{
  if(CONFIG_fbaid)loginFacebook();
  else{toggleCfg(true);toast('Dán Facebook App ID vào khung ⚙️ cấu hình trước nhé.');}
});
`.replace('CONFIG_fbaid', 'FB&&FB.fbaid'));

/* 4. Chữ: cập nhật các dòng nhắc */
const subs = [
  ['Đăng nhập thật qua Google / Facebook — tên, email và ảnh đại diện lấy trực tiếp từ tài khoản của bạn.',
   'Đăng nhập thật qua Google — tên, email và ảnh đại diện lấy trực tiếp từ tài khoản của bạn.'],
  ['✓ Đăng nhập Google/Facebook thật đã bật', '✓ Đăng nhập Google thật đã bật'],
  ["toast('Đăng nhập thật đã bật. Thử bấm \"Tiếp tục với Google\" nhé!');", "toast('Đăng nhập thật đã bật. Thử bấm \"Tiếp tục với Google\" nhé!');"]
];
for (const [a, b] of subs) {
  if (h.includes(a)) h = h.replace(a, () => b);
  else missing.push('text: ' + a.slice(0, 30));
}

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'FB removed OK');
process.exit(missing.length ? 1 : 0);

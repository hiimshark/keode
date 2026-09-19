// v0.6: thay hướng dẫn OAuth rườm rà bằng Firebase Auth 1-paste.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');

/* ---------- 1. HTML: thay toàn bộ cfgPanel cũ bằng wizard Firebase ---------- */
const pStart = h.indexOf('<div id="cfgPanel" class="cfgpanel hide">');
const pEnd = h.indexOf('<p class="lstats">', pStart);
if (pStart < 0 || pEnd < 0) { console.log('cfgPanel block not found'); process.exit(1); }
const newPanel = `<div id="cfgPanel" class="cfgpanel hide">
        <p class="cfgtitle"><b>Bật đăng nhập thật bằng Firebase — làm 1 lần duy nhất (~5 phút, copy-paste)</b></p>
        <ol>
          <li>Vào <b>console.firebase.google.com</b> → <b>Add project</b> → đặt tên (vd: keode) → Create (tắt Analytics cho lẹ).</li>
          <li>Menu trái <b>Build → Authentication → Get started</b> → tab <b>Sign-in method</b> → bật <b>Google</b> → Save. <i>(Muốn thêm Facebook: bật Facebook, dán App ID + App secret từ developers.facebook.com.)</i></li>
          <li>Vẫn trong Authentication → <b>Settings → Authorized domains</b> → thấy sẵn <code>localhost</code>. Nếu mở web bằng 127.0.0.1 thì <b>Add domain</b> <code>127.0.0.1</code>.</li>
          <li>Bánh răng ⚙️ <b>Project settings</b> → cuộn xuống <b>Your apps</b> → biểu tượng <b>&lt;/&gt; Web</b> → đặt tên → copy <b>cả đoạn firebaseConfig</b> → dán vào ô bên dưới.</li>
        </ol>
        <textarea id="cfgPaste" rows="4" placeholder="const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "keode.firebaseapp.com",
  projectId: "keode",
  appId: "1:123:web:abc"
}"></textarea>
        <div class="cfgsave"><span id="cfgMsg"></span><button class="btn btn-p btn-sm" id="cfgSave" type="button">Lưu &amp; bật đăng nhập thật</button></div>
        <p class="cfgnote">Config này <b>không phải mật khẩu</b> — Google thiết kế để nhúng thẳng vào web, an toàn khi public. Sau khi lưu, bấm tải file <code>auth-config.js</code> đặt cạnh <code>keo-de.html</code>: từ đó <b>người dùng không thấy bước này nữa</b>, chỉ bấm nút Google và chọn tài khoản.</p>
        <button class="btn btn-sm" id="cfgDownload" type="button">⬇️ Tải auth-config.js (để nhúng sẵn khi deploy)</button>
      </div>
      `;
h = h.slice(0, pStart) + newPanel + h.slice(pEnd);

/* ---------- 2. JS: thay CONFIG/GIS bằng Firebase ---------- */
const jStart = h.indexOf("/* ---- ĐĂNG NHẬP THẬT: Google Identity Services + Facebook JS SDK ----");
const jEndAnchor = "function toggleCfg(open){$('#cfgPanel').classList.toggle('hide',!open);}";
const jEnd = h.indexOf(jEndAnchor);
if (jStart < 0 || jEnd < 0) { console.log('auth js block not found'); process.exit(1); }
const newJs = `/* ---- ĐĂNG NHẬP THẬT bằng Firebase Auth (Google + Facebook popup) ----
   Người dùng cuối KHÔNG cấu hình gì: mở web, bấm nút, chọn tài khoản Google/FB.
   Chủ web làm 1 lần: dán firebaseConfig vào khung cấu hình (hoặc đặt file auth-config.js cạnh HTML). */
let FB=window.KEO_FIREBASE_CONFIG||load('keode.firebase.v1',null);
let session=load('keode.session.v1',null);
function avatarHTML(m,s=30){
  if(m&&m.picture)return \`<img class="avc avcimg" src="\${esc(m.picture)}" alt="" style="width:\${s}px;height:\${s}px" referrerpolicy="no-referrer">\`;
  return avCircle(m&&m.color||'#2E5BE8',firstLetter(m&&m.name||'?'),s);
}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('fail'));document.head.appendChild(s);});}
function fbValid(f){return !!(f&&f.apiKey&&f.authDomain&&f.projectId&&f.appId);}
function parseSnippet(t){
  if(!t)return null;
  const g=k=>{const m=t.match(new RegExp(k+'\\\\s*[:=]\\\\s*["\\']([^"\\\\']+)["\\']'));return m?m[1]:'';};
  const f={apiKey:g('apiKey'),authDomain:g('authDomain'),projectId:g('projectId'),appId:g('appId')};
  return fbValid(f)?f:null;
}
async function ensureFirebase(){
  if(window.firebase&&window.firebase.auth)return;
  await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js');
  firebase.initializeApp(FB);
  firebase.auth().useDeviceLanguage();
}
async function loginGoogle(){
  if(!fbValid(FB)){toggleCfg(true);toast('Dán firebaseConfig vào khung ⚙️ cấu hình trước nhé.');return;}
  toast('Đang mở Google…');
  try{
    await ensureFirebase();
    const cred=await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    startSession({provider:'google',id:cred.user.uid,name:cred.user.displayName||'Bạn',email:cred.user.email||'',picture:cred.user.photoURL||''});
  }catch(e){handleAuthErr(e);}
}
async function loginFacebook(){
  if(!fbValid(FB)){toggleCfg(true);toast('Dán firebaseConfig vào khung ⚙️ cấu hình trước nhé.');return;}
  toast('Đang mở Facebook…');
  try{
    await ensureFirebase();
    const cred=await firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
    startSession({provider:'facebook',id:cred.user.uid,name:cred.user.displayName||'Bạn',email:cred.user.email||'',picture:cred.user.photoURL||''});
  }catch(e){handleAuthErr(e);}
}
function handleAuthErr(e){
  const M={
    'auth/unauthorized-domain':'Firebase chặn domain này — mở web bằng http://localhost:8787 hoặc thêm 127.0.0.1 vào Authentication → Settings → Authorized domains.',
    'auth/popup-blocked':'Trình duyệt chặn popup — cho phép popup rồi bấm lại.',
    'auth/popup-closed-by-user':'Bạn đã đóng popup đăng nhập.',
    'auth/cancelled-popup-request':'Bạn đã đóng popup đăng nhập.',
    'auth/operation-not-allowed':'Chưa bật provider: Firebase Console → Authentication → Sign-in method.',
    'auth/account-exists-with-different-credential':'Email này đã đăng nhập bằng nhà cung cấp khác.'
  };
  toast(M[e&&e.code]||('Lỗi đăng nhập: '+((e&&e.message)||e)));
}
function renderLoginAuth(){
  const st=$('#cfgStatus');
  if(st)st.innerHTML=fbValid(FB)
    ?'<span class="okb">✓ Đăng nhập Google/Facebook thật đã bật</span> <span style="color:var(--mut)">— người dùng chỉ cần bấm nút và chọn tài khoản</span>'
    :'<span class="nob">Chưa bật đăng nhập thật</span> — bấm ⚙️ bên dưới để cấu hình 1 lần (5 phút).';
  if(fbValid(FB))$('#cfgPanel').classList.add('hide');
}
`;
h = h.slice(0, jStart) + newJs + h.slice(jEnd);

/* ---------- 3. Handlers ---------- */
const hStart = h.indexOf("$('#gMock').addEventListener");
const hEndAnchor = "/* ---- Đăng xuất: bấm vào chip tài khoản ---- */";
const hEnd = h.indexOf(hEndAnchor);
if (hStart < 0 || hEnd < 0) { console.log('handlers block not found'); process.exit(1); }
const newHandlers = `$('#gMock').addEventListener('click',loginGoogle);
$('#fbBtn').addEventListener('click',loginFacebook);
$('#cfgToggle').addEventListener('click',()=>toggleCfg($('#cfgPanel').classList.contains('hide')));
$('#cfgSave').addEventListener('click',()=>{
  const parsed=parseSnippet($('#cfgPaste').value);
  if(!parsed){$('#cfgMsg').textContent='❌ Chưa đúng — hãy dán nguyên đoạn firebaseConfig (cần apiKey, authDomain, projectId, appId).';return;}
  FB=parsed;save('keode.firebase.v1',FB);
  renderLoginAuth();
  $('#cfgMsg').textContent='✓ Đã bật đăng nhập thật! Bấm nút Google để thử.';
  toast('Đăng nhập thật đã bật. Thử bấm "Tiếp tục với Google" nhé!');
});
$('#cfgDownload').addEventListener('click',()=>{
  if(!fbValid(FB)){toast('Lưu cấu hình đã nhé.');return;}
  const blob=new Blob(['// KÈO ĐÊ — cấu hình Firebase (public-safe)\\nwindow.KEO_FIREBASE_CONFIG = '+JSON.stringify(FB,null,2)+';\\n'],{type:'text/javascript'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='auth-config.js';a.click();
  toast('Đã tải auth-config.js — đặt cạnh keo-de.html là người dùng không cần cấu hình.');
});
$('#demoLink').addEventListener('click',()=>{
  session={provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''};
  save('keode.session.v1',session);
  route('onboard');applyRoute();
});
`;
h = h.slice(0, hStart) + newHandlers + h.slice(hEnd);

/* ---------- 4. logout thêm signOut firebase ---------- */
h = h.replace("  session=null;profile=null;\n  localStorage.removeItem('keode.session.v1');",
  "  session=null;profile=null;\n  if(window.firebase)try{firebase.auth().signOut();}catch(e){}\n  localStorage.removeItem('keode.session.v1');");

fs.writeFileSync('keo-de.html', h);
console.log('v0.6 firebase login patched | size:', (h.length / 1024).toFixed(1) + 'KB');

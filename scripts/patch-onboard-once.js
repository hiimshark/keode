// Onboarding chỉ chạy 1 LẦN: đã có hồ sơ khớp tài khoản → vào thẳng app; logout giữ hồ sơ.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. startSession: hồ sơ đã có (và khớp tài khoản) → vào thẳng web */
rep(`function startSession(s){
  session=s;save('keode.session.v1',s);
  toast('Đăng nhập thành công: '+(s.name||'bạn'));
  if(s.provider!=='demo'&&fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}
  route('onboard');applyRoute();
}`,
`function startSession(s){
  session=s;save('keode.session.v1',s);
  if(s.provider!=='demo'&&fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}
  const sameProfile=profile&&(profile.email||'')===(s.email||''); // đã có hồ sơ của chính tài khoản này
  if(sameProfile){
    route('discover');applyRoute();
    toast('Chào lại '+profile.name+'! Vào kèo thôi.');
  }else{
    route('onboard');applyRoute(); // lần đầu → onboarding đúng 1 lần
  }
}`, 'startSession once');

/* 2. logout: giữ hồ sơ → đăng nhập lại vào thẳng web */
rep(`  session=null;profile=null;
  if(window.firebase)try{firebase.auth().signOut();}catch(e){}
  localStorage.removeItem('keode.session.v1');
  localStorage.removeItem('keode.profile.v1');`,
`  session=null;
  if(window.firebase)try{firebase.auth().signOut();}catch(e){}
  localStorage.removeItem('keode.session.v1'); // giữ profile — đăng nhập lại vào thẳng web`, 'logout keep profile');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'onboard-once OK');
process.exit(missing.length ? 1 : 0);

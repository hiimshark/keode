// Chèn định nghĩa startSession + initCloud (bị mất từ v0.6 splice).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const anchor = `function toggleCfg(open){$('#cfgPanel').classList.toggle('hide',!open);}`;
const block = `function toggleCfg(open){$('#cfgPanel').classList.toggle('hide',!open);}
async function initCloud(){
  try{
    await ensureFirebase();
    await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
    db=firebase.firestore();
    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
      CLOUD_KEO=snap.docs.map(d=>Object.assign({id:d.id},d.data()));
      cloudConnecting=false;
      if(MODE!=='cloud'){MODE='cloud';toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
      renderAll();updateModeBadge();
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});
  }catch(e){cloudConnecting=false;MODE='local';updateModeBadge();toast('Không kết nối được cloud — đang dùng chế độ máy bạn.');}
}
function startSession(s){
  session=s;save('keode.session.v1',s);
  toast('Đăng nhập thành công: '+(s.name||'bạn'));
  if(s.provider!=='demo'&&fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}
  route('onboard');applyRoute();
}`;
if (h.includes(anchor)) { h = h.replace(anchor, block); }
else if (!h.includes('async function initCloud()')) { console.log('ANCHOR NOT FOUND'); process.exit(1); }
else { console.log('already present'); }
fs.writeFileSync('keo-de.html', h);
console.log('startSession + initCloud OK');

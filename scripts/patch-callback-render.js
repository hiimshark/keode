// Keos callback: thêm updateModeBadge + renderAll (trước đó chỉ set biến, không vẽ UI).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
      CLOUD_KEO=snap.docs.map(d=>{const o=Object.assign({id:d.id},d.data());o.cat=normCat(o.cat);return o;});
      cloudConnecting=false;
      const wasLocal=MODE!=='cloud';
      if(wasLocal){MODE='cloud';toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
      /* migrate: kèo/quán đã tạo lúc local (trước khi có cloud) đẩy lên cloud 1 lần */
      if(KEO.length&&session&&session.id){
        const ids=new Set(CLOUD_KEO.map(x=>String(x.id)));
        KEO.forEach(p=>{if(!ids.has(String(p.id))){const{ id,...data }=p;db.collection('keos').doc(String(p.id)).set(Object.assign({},data,{hostUid:session.id})).catch(()=>{});}});
        KEO=[];save('keode.posts.v2',KEO);
      }
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});`;
const b = `    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
      CLOUD_KEO=snap.docs.map(d=>{const o=Object.assign({id:d.id},d.data());o.cat=normCat(o.cat);return o;});
      cloudConnecting=false;
      const wasLocal=MODE!=='cloud';
      if(wasLocal){MODE='cloud';}
      updateModeBadge();
      try{
        /* migrate: kèo/quán đã tạo lúc local (trước khi có cloud) đẩy lên cloud 1 lần */
        if(KEO.length&&session&&session.id){
          const ids=new Set(CLOUD_KEO.map(x=>String(x.id)));
          KEO.forEach(p=>{if(!ids.has(String(p.id))){const{ id,...data }=p;db.collection('keos').doc(String(p.id)).set(Object.assign({},data,{hostUid:session.id})).catch(()=>{});}});
          KEO=[];save('keode.posts.v2',KEO);
        }
        renderAll();
      }catch(e){console.warn('render sau snapshot:',e);}
      if(wasLocal){toast('☁️ Đã kết nối cloud — kèo của mọi người hiển thị chung.');}
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('callback render OK');

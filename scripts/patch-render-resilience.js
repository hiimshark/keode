// renderAll chống-đổ (mỗi phần tự chịu lỗi) + join cập nhật UI tức thì + callback chỉnh thứ tự.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. callback: set state + badge TRƯỚC renderAll; migrate bọc try */
rep(`    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
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
      renderAll();updateModeBadge();
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});`,
`    db.collection('keos').orderBy('created','desc').limit(150).onSnapshot(snap=>{
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
    },err=>{cloudConnecting=false;MODE='local';updateModeBadge();toast('Cloud lỗi: '+err.message+' — tạm dùng chế độ máy bạn.');});`, 'callback reorder');

/* 2. renderAll: từng phần tự chịu lỗi */
rep(`function renderAll(){renderFeed();renderRadar();renderPartnerStrip();renderMine();renderVenues();updateModeBadge();}`,
`function renderAll(){
  [['feed',renderFeed],['radar',renderRadar],['pstrip',renderPartnerStrip],['mine',renderMine],['venues',renderVenues]].forEach(([n,fn])=>{
    try{fn();}catch(e){console.warn('render '+n+':',e);}
  });
  updateModeBadge();
}`, 'renderAll resilient');

/* 3. join cloud thành công → cập nhật UI tức thì */
rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});}catch(e){toast('Lỗi cloud: '+e.message);return;}}`,
`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];}catch(e){toast('Lỗi cloud: '+e.message);return;}}`, 'join optimistic');
rep(`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});}catch(e){toast('Lỗi cloud: '+e.message);return;}}`,
`    if(MODE==='cloud'){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}catch(e){toast('Lỗi cloud: '+e.message);return;}}`, 'cancel optimistic');
rep(`  if(MODE!=='cloud'){openDetail(id);renderFeed();}
}`,
`  renderFeed();renderMine();
  if(MODE!=='cloud'){openDetail(id);}
}`, 'join UI refresh');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'render resilience OK');
process.exit(missing.length ? 1 : 0);

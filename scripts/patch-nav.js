// v0.7.1 — Fix điều hướng: route cùng hash vẫn render ngay; ← quay về đúng trang xuất phát.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, b);
}

/* 1. route(): luôn áp dụng ngay, không phụ thuộc hashchange */
rep(`function route(r){location.hash=r;}
window.addEventListener('hashchange',applyRoute);`,
`function route(r){
  r=r||'discover';
  if(('#'+r)!==location.hash)location.hash=r;
  applyRouteNow(r);
}
window.addEventListener('hashchange',()=>applyRouteNow((location.hash||'#discover').slice(1)));
function applyRoute(){applyRouteNow((location.hash||'#discover').slice(1));}
function applyRouteNow(h){`, 'route()');

/* 2. openDetail: nhớ nơi xuất phát + đồng bộ hash bằng replaceState */
rep(`function openDetail(id){
  const p=allKeo().find(x=>String(x.id)===String(id));
  if(!p){route('discover');return;}
  currentKeoId=id;
  \$('#detailBody').innerHTML=detailHTML(p);
  showPage('detail');
  miniRadar(p);
  window.scrollTo(0,0);
}`,
`let detailFrom='discover';
function openDetail(id,from){
  const p=allKeo().find(x=>String(x.id)===String(id));
  if(!p){route('discover');return;}
  if(from)detailFrom=from;
  currentKeoId=id;
  \$('#detailBody').innerHTML=detailHTML(p);
  \$('#backBtn').textContent=detailFrom==='mine'?'← Kèo của tôi':'← Khám phá';
  showPage('detail');
  miniRadar(p);
  if((location.hash||'')!=='#keo/'+id)history.replaceState(null,'','#keo/'+id);
  window.scrollTo(0,0);
}`, 'openDetail');

/* 3. back button: về đúng nơi xuất phát */
rep(`\$('#backBtn').addEventListener('click',()=>route('discover'));`,
`\$('#backBtn').addEventListener('click',()=>route(detailFrom==='mine'?'mine':'discover'));`, 'backBtn');

/* 4. deleteKeo: về nơi xuất phát sau khi xoá */
rep(`  toast('Đã xoá kèo.');
  route('discover');
}`,
`  toast('Đã xoá kèo.');
  route(detailFrom==='mine'?'mine':'discover');
}`, 'deleteKeo route');

/* 5. các điểm mở chi tiết: truyền nơi xuất phát */
rep(`  const view=e.target.closest('.kcard');
  if(view)openDetail(view.dataset.id);`,
`  const view=e.target.closest('.kcard');
  if(view)openDetail(view.dataset.id,'discover');`, 'feed → detail');
rep(`\$('#mineHost').addEventListener('click',e=>{const c=e.target.closest('.kcard');if(c)openDetail(c.dataset.id);});
\$('#mineJoin').addEventListener('click',e=>{const c=e.target.closest('.kcard');if(c)openDetail(c.dataset.id);});`,
`\$('#mineHost').addEventListener('click',e=>{const c=e.target.closest('.kcard');if(c)openDetail(c.dataset.id,'mine');});
\$('#mineJoin').addEventListener('click',e=>{const c=e.target.closest('.kcard');if(c)openDetail(c.dataset.id,'mine');});`, 'mine → detail');
rep(`  if(it){closeRadarPop();openDetail(it.dataset.go);}`,
`  if(it){closeRadarPop();openDetail(it.dataset.go,'discover');}`, 'radar → detail');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch nav OK');
process.exit(missing.length ? 1 : 0);

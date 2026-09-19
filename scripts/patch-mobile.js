// v0.8.1 — Mobile UX/UI: nút quay lại pill đẹp + bottom nav như app + topbar gọn + circles lướt ngang.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. Nút quay lại dạng pill (mũi tên vòng tròn + nhãn không xuống dòng) */
rep(`.dback{margin:18px 0 14px;border-radius:999px;width:44px;height:44px;padding:0;font-size:18px}`,
`.dback{margin:16px 0 14px;display:inline-flex;align-items:center;gap:9px;border-radius:999px;padding:7px 20px 7px 9px;font-weight:600;font-size:14px;white-space:nowrap;box-shadow:var(--sh-sm)}
.dback .arr{width:28px;height:28px;border-radius:50%;background:var(--blue-t);display:flex;align-items:center;justify-content:center;color:var(--blue);font-size:15px;flex:none}
.dback:hover{border-color:var(--blue);color:var(--blue)}`, 'dback css');

rep(`<button class="btn dback" id="backBtn" type="button" aria-label="Quay lại">←</button>`,
`<button class="btn dback" id="backBtn" type="button"><span class="arr">←</span><span id="backLabel">Khám phá</span></button>`, 'dback html');

rep(`  \$('#backBtn').textContent=detailFrom==='mine'?'← Kèo của tôi':'← Khám phá';`,
`  \$('#backLabel').textContent=detailFrom==='mine'?'Kèo của tôi':'Khám phá';`, 'backLabel js');

/* 2. Mobile bottom nav + media queries nâng cấp */
rep(`@media (max-width:820px){
  .feed{grid-template-columns:1fr}
  .tabs{display:none}
  .wordmark{font-size:64px}
  .hero h1{font-size:40px}
}
#view-app:has(#page-detail.on) .fab{display:none}`,
`/* ---------- MOBILE ---------- */
.mnav{display:none}
@media (max-width:820px){
  .feed{grid-template-columns:1fr}
  .tabs{display:none}
  .wordmark{font-size:52px}
  .hero h1{font-size:38px}
  .topbar{padding:8px 14px;gap:10px}
  .user-chip span:last-child{display:none}
  .user-chip{padding:4px 5px}
  .topbar .js-open-modal{display:none}
  .circles{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;margin:12px -24px 8px;padding:6px 24px 10px;scrollbar-width:none}
  .circles::-webkit-scrollbar{display:none}
  .searchbar .loc select{max-width:118px}
  .fab{bottom:calc(68px + env(safe-area-inset-bottom,0px));right:14px}
  .toast{bottom:78px}
  #view-app{padding-bottom:62px}
  .board{padding:20px 18px}
  .dcover{height:200px}
  #atabs{overflow-x:auto;max-width:100%}
  #view-admin .topbar{flex-wrap:wrap;row-gap:8px}
  .mnav{display:grid;grid-template-columns:repeat(4,1fr)}
}
.mnav{position:fixed;left:0;right:0;bottom:0;z-index:56;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);
  border-top:1px solid var(--line);padding:7px 6px calc(7px + env(safe-area-inset-bottom,0px))}
.mnav button{background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;
  font:600 10.5px "Be Vietnam Pro",sans-serif;color:var(--mut);padding:4px 2px;border-radius:10px}
.mnav button .mi{font-size:19px;line-height:1}
.mnav button.on{color:var(--blue)}
#view-app:has(#page-detail.on) .mnav{display:none}
#view-app:has(#page-detail.on) .fab{display:none}`, 'mobile css');

/* 3. Bottom nav HTML (trong #view-app, sau FAB) */
rep(`  <button class="btn btn-p fab js-open-modal" type="button">＋ Tạo kèo</button>
</div>

<!-- ============ MODAL: TẠO KÈO ============ -->`,
`  <button class="btn btn-p fab js-open-modal" type="button">＋ Tạo kèo</button>
  <nav class="mnav" id="mnav" aria-label="Điều hướng">
    <button type="button" data-route="discover" class="on"><span class="mi">🔎</span>Khám phá</button>
    <button type="button" data-route="mine"><span class="mi">📌</span>Kèo của tôi</button>
    <button type="button" data-route="venues"><span class="mi">🏪</span>Quán</button>
    <button type="button" data-route="inbox"><span class="mi">💬</span>Tin nhắn</button>
  </nav>
</div>

<!-- ============ MODAL: TẠO KÈO ============ -->`, 'mnav html');

/* 4. mnav click + sync trạng thái on trong showPage */
rep(`\$('#tabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(t)route(t.dataset.route);});`,
`\$('#tabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(t)route(t.dataset.route);});
\$('#mnav').addEventListener('click',e=>{const t=e.target.closest('button');if(t)route(t.dataset.route);});`, 'mnav click');

rep(`  \$\$('#tabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.route===p||(p==='detail'&&t.dataset.route==='discover')));`,
`  \$\$('#tabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.route===p||(p==='detail'&&t.dataset.route==='discover')));
  \$\$('#mnav button').forEach(b=>b.classList.toggle('on',b.dataset.route===p||(p==='detail'&&b.dataset.route==='discover')));`, 'showPage mnav sync');

/* 5. version bump */
rep(`KÈO ĐÊ — v0.8 "ADMIN PANEL"`, `KÈO ĐÊ — v0.8.1 "MOBILE UX"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch mobile OK');
process.exit(missing.length ? 1 : 0);

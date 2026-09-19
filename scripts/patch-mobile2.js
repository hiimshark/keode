// v0.8.1 part2 — 3 anchor thật: dback html, mobile css, mnav html.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. dback html (aria-label thật là "Về khám phá") */
rep(`<button class="btn dback" id="backBtn" type="button" aria-label="Về khám phá">←</button>`,
`<button class="btn dback" id="backBtn" type="button"><span class="arr">←</span><span id="backLabel">Khám phá</span></button>`, 'dback html');

/* 2. mobile css (khối 820px thật) */
rep(`@media (max-width:820px){
  .feed{grid-template-columns:1fr}
  .tabs{display:none}
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

/* 3. mnav html — chèn sau FAB, trước đóng #view-app (trước POLICY comment) */
rep(`  <button class="btn btn-p fab js-open-modal" type="button">＋ Tạo kèo</button>
</div>

<!-- ============ POLICY ============ -->`,
`  <button class="btn btn-p fab js-open-modal" type="button">＋ Tạo kèo</button>
  <nav class="mnav" id="mnav" aria-label="Điều hướng">
    <button type="button" data-route="discover" class="on"><span class="mi">🔎</span>Khám phá</button>
    <button type="button" data-route="mine"><span class="mi">📌</span>Kèo của tôi</button>
    <button type="button" data-route="venues"><span class="mi">🏪</span>Quán</button>
    <button type="button" data-route="inbox"><span class="mi">💬</span>Tin nhắn</button>
  </nav>
</div>

<!-- ============ POLICY ============ -->`, 'mnav html');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch mobile2 OK');
process.exit(missing.length ? 1 : 0);

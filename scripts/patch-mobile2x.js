// v0.9.6 — Mobile UX tổng lực: hết tràn viền + không còn phần bị mất.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

rep(`@media (max-width:820px){
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
}`,
`@media (max-width:820px){
  .feed{grid-template-columns:1fr}
  .tabs{display:none}
  .wordmark{font-size:44px}
  .tagline{font-size:14.5px}
  .hero h1{font-size:33px}
  .hero p{font-size:13.5px}
  .hero-badge{font-size:10.5px;padding:5px 12px;letter-spacing:.1em}
  .hero-txt{margin-top:-30px;padding-bottom:18px}
  .topbar{padding:8px 12px;gap:8px}
  .tb-word{font-size:20px}
  .user-chip span:last-child{display:none}
  .user-chip{padding:3px 4px}
  .bell{width:36px;height:36px}
  .topbar .js-open-modal{display:none}
  .circles{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;margin:10px -12px 6px;padding:6px 12px 10px;scrollbar-width:none;gap:12px}
  .circles::-webkit-scrollbar{display:none}
  .cir .bub{width:56px;height:56px;font-size:25px}
  .searchbar{margin:18px 0 4px}
  .searchbar input{padding:12px 10px;font-size:14px}
  .searchbar .loc{padding:8px 10px}
  .searchbar .loc select{max-width:108px;font-size:13px}
  .wrap{padding:0 14px}
  .sechead h2{font-size:23px}
  .fab{bottom:calc(70px + env(safe-area-inset-bottom,0px));right:12px;padding:11px 18px;font-size:14px}
  .toast{bottom:80px;font-size:13.5px}
  #view-app{padding-bottom:64px}
  .board{padding:18px 14px}
  .board .blab{font-size:19px}
  .btn-oauth{font-size:14px;padding:10px 12px}
  .obcard{padding:18px 14px}
  .ob h1{font-size:28px}
  .avrow{gap:12px}
  .avprev{width:56px;height:56px;font-size:24px}
  .dcover{height:185px}
  .dcover .cico{font-size:58px}
  .dtitle{font-size:28px}
  .dgrid{gap:16px}
  .dpanel{padding:13px 14px}
  /* stickybar: xếp dọc vừa màn hình, hết tràn */
  .stickybar{flex-wrap:wrap;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));gap:8px}
  .stickybar .btn{min-width:0;width:100%}
  .stickybar .btn.btn-lg{max-width:100%}
  /* form modal: ngày/giờ 2 cột, số người xuống dòng */
  .f3{grid-template-columns:1fr 1fr}
  .f3 > div:last-child{grid-column:1/-1}
  .modal{padding:16px 14px 18px}
  .venueform{padding:18px 14px}
  .venueform .frow{grid-template-columns:1fr}
  .vgrid{grid-template-columns:1fr}
  /* radar: ẩn nhãn pin (hết bị cắt ở mép), chấm + legend là đủ */
  .pinlab{display:none}
  .pin{width:13px;height:13px;border-width:2px}
  .radar-pop{width:min(230px,84%)}
  .pcard{flex:0 0 224px}
  .kbtns{gap:6px}
  .kbtns .btn{font-size:13px;padding:8px 6px}
  .ktitle{font-size:18px}
  .khost .star{display:none}
  .foot{font-size:11px;padding:10px 10px;line-height:1.7}
  #atabs{overflow-x:auto;max-width:100%;scrollbar-width:none}
  #atabs::-webkit-scrollbar{display:none}
  #view-admin .topbar{flex-wrap:wrap;row-gap:8px}
  .astats{grid-template-columns:repeat(2,1fr)}
  .agrid{grid-template-columns:1fr}
  .atwrap{overflow-x:auto}
  .mnav{display:grid;grid-template-columns:repeat(4,1fr)}
}
@media (max-width:420px){
  .swatches{grid-template-columns:repeat(4,1fr)}
  .swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .fbtns{flex-wrap:wrap;gap:10px}
  .fbtns .btn{flex:1 1 auto}
}`, 'mobile css v2');

/* FAB + modal: modal padding mobile dùng .modal — đã có; sửa stickybar desktop min-width không đè mobile */
rep(`.stickybar .btn{min-width:230px}`, `.stickybar .btn{min-width:230px}
@media (max-width:820px){.stickybar .btn{min-width:0}}`, 'stickybar desktop');

/* version */
rep(`KÈO ĐÊ — v0.9.4 "CLOUD-ONLY"`, `KÈO ĐÊ — v0.9.6 "MOBILE POLISH"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'mobile polish OK');
process.exit(missing.length ? 1 : 0);

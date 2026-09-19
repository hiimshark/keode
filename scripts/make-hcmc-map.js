// Rasterize TP. Hồ Chí Minh (ADM1) into a pixel grid + district pin cells.
// Source: geoBoundaries gbOpen VNM ADM1 (CC BY 4.0).
const fs = require('fs');
const path = require('path');

const gj = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'vn-adm1.geojson'), 'utf8'));
const hcm = gj.features.find(f => /ho\s?chi\s?minh|thanh\s?pho\s?ho\s?chi\s?minh/i.test(f.properties.shapeName)
  || f.properties.shapeName === 'Hồ Chí Minh' || f.properties.shapeName === 'TP. Hồ Chí Minh');
if (!hcm) { console.error('KHÔNG thấy feature HCMC. Danh sách:', gj.features.map(f => f.properties.shapeName).join(', ')); process.exit(1); }
console.log('Feature:', hcm.properties.shapeName);

// Even-odd point-in-polygon across all rings
const rings = [];
(function collect(g) {
  if (g.type === 'Polygon') rings.push(...g.coordinates);
  else if (g.type === 'MultiPolygon') for (const poly of g.coordinates) rings.push(...poly);
})(hcm.geometry);

function inside(lon, lat) {
  let c = 0;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
    if ((yi > lat) !== (yj > lat)) {
      const x = xi + ((lat - yi) * (xj - xi)) / (yj - yi);
      if (lon < x) c++;
    }
  }
  return c % 2 === 1;
}

// bbox của HCMC
let lonMin = 999, lonMax = -999, latMin = 999, latMax = -999;
for (const r of rings) for (const [x, y] of r) {
  if (x < lonMin) lonMin = x; if (x > lonMax) lonMax = x;
  if (y < latMin) latMin = y; if (y > latMax) latMax = y;
}
console.log('bbox lon', lonMin.toFixed(3), lonMax.toFixed(3), '| lat', latMin.toFixed(3), latMax.toFixed(3));

const COLS = 40;
const cell = (lonMax - lonMin) / COLS;
const ROWS = Math.round((latMax - latMin) / cell);
const lines = [];
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    const lon = lonMin + (c + 0.5) * cell;
    const lat = latMax - (r + 0.5) * cell;
    line += inside(lon, lat) ? '#' : '.';
  }
  lines.push(line);
}
console.log('=== ' + COLS + ' x ' + ROWS + ' ===');
console.log(lines.join('\n'));

// Tâm quận/huyện (xấp xỉ trung tâm hành chính) — chỉ để đặt pin trên radar pixel
const DISTRICTS = {
  q1:        { n: 'Quận 1',       lon: 106.700, lat: 10.776, side: 'r' },
  q3:        { n: 'Quận 3',       lon: 106.692, lat: 10.783, side: 'l' },
  q4:        { n: 'Quận 4',       lon: 106.705, lat: 10.756, side: 'r' },
  q5:        { n: 'Quận 5',       lon: 106.667, lat: 10.754, side: 'l' },
  q6:        { n: 'Quận 6',       lon: 106.635, lat: 10.738, side: 'l' },
  q7:        { n: 'Quận 7',       lon: 106.721, lat: 10.738, side: 'r' },
  q8:        { n: 'Quận 8',       lon: 106.645, lat: 10.727, side: 'l' },
  q10:       { n: 'Quận 10',      lon: 106.668, lat: 10.776, side: 'l' },
  q11:       { n: 'Quận 11',      lon: 106.652, lat: 10.762, side: 'l' },
  q12:       { n: 'Quận 12',      lon: 106.655, lat: 10.848, side: 'l' },
  binhthanh: { n: 'Bình Thạnh',   lon: 106.690, lat: 10.801, side: 'r' },
  phunhuan:  { n: 'Phú Nhuận',    lon: 106.678, lat: 10.800, side: 'l' },
  tanbinh:   { n: 'Tân Bình',     lon: 106.652, lat: 10.804, side: 'l' },
  tanphu:    { n: 'Tân Phú',      lon: 106.626, lat: 10.794, side: 'l' },
  govap:     { n: 'Gò Vấp',       lon: 106.725, lat: 10.842, side: 'r' },
  binhtan:   { n: 'Bình Tân',     lon: 106.587, lat: 10.762, side: 'l' },
  thuduc:    { n: 'Thủ Đức',      lon: 106.754, lat: 10.867, side: 'r' },
  binhchanh: { n: 'Bình Chánh',   lon: 106.518, lat: 10.743, side: 'l' },
  hocmon:    { n: 'Hóc Môn',      lon: 106.588, lat: 10.882, side: 'l' },
  cuchi:     { n: 'Củ Chi',       lon: 106.510, lat: 11.020, side: 'l' },
  nhabe:     { n: 'Nhà Bè',       lon: 106.678, lat: 10.700, side: 'l' },
  cangio:    { n: 'Cần Giờ',      lon: 106.870, lat: 10.500, side: 'r' },
};
const pins = {};
for (const [k, d] of Object.entries(DISTRICTS)) {
  pins[k] = {
    n: d.n, side: d.side,
    col: Math.round((d.lon - lonMin) / cell - 0.5),
    row: Math.round((latMax - d.lat) / cell - 0.5),
  };
}

const out = {
  bbox: { lonMin, lonMax, latMin, latMax },
  cols: COLS, rows: ROWS, cell,
  map: lines,
  pins,
};
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'hcmc-map.json'), JSON.stringify(out, null, 1));
console.error('Wrote assets/hcmc-map.json');

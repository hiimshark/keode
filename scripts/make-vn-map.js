// Rasterize Vietnam ADM0 boundary into pixel grids for the prototype maps.
// Source: geoBoundaries gbOpen VNM ADM0 (CC BY 4.0), simplified geometry.
const fs = require('fs');
const path = require('path');

const gj = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'vn-simplified.geojson'), 'utf8'));

// Collect all rings ( Polygon / MultiPolygon ). Even-odd across ALL rings handles holes.
const rings = [];
for (const f of gj.features) {
  const g = f.geometry;
  if (g.type === 'Polygon') rings.push(...g.coordinates);
  else if (g.type === 'MultiPolygon') for (const poly of g.coordinates) rings.push(...poly);
}

function inside(lon, lat) {
  // Even-odd rule across all rings — island rings and holes fall out naturally.
  let crossings = 0;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if ((yi > lat) !== (yj > lat)) {
        const xint = xi + ((lat - yi) * (xj - xi)) / (yj - yi);
        if (lon < xint) crossings++;
      }
    }
  }
  return crossings % 2 === 1;
}

const BOUNDS = { lonMin: 102.0, lonMax: 110.0, latMin: 8.2, latMax: 23.45 };

function rasterize(cols) {
  const cell = (BOUNDS.lonMax - BOUNDS.lonMin) / cols;
  const rows = Math.round((BOUNDS.latMax - BOUNDS.latMin) / cell);
  const rowsArr = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      const lon = BOUNDS.lonMin + (c + 0.5) * cell;
      const lat = BOUNDS.latMax - (r + 0.5) * cell;
      line += inside(lon, lat) ? '#' : '.';
    }
    rowsArr.push(line);
  }
  return { cols, rows, cell, lines: rowsArr };
}

const CITIES = {
  hanoi:    { name: 'Hà Nội',      lon: 105.85, lat: 21.03 },
  haiphong: { name: 'Hải Phòng',   lon: 106.68, lat: 20.86 },
  hue:      { name: 'Huế',         lon: 107.60, lat: 16.46, dc: -1 },   // coastal: nudge pin onto land cell
  danang:   { name: 'Đà Nẵng',     lon: 108.24, lat: 16.05, dc: -1 },   // coastal
  quynhon:  { name: 'Quy Nhơn',    lon: 109.23, lat: 13.78 },
  nhatrang: { name: 'Nha Trang',   lon: 109.19, lat: 12.24 },
  dalat:    { name: 'Đà Lạt',      lon: 108.44, lat: 11.94 },
  hcmc:     { name: 'TP. Hồ Chí Minh', lon: 106.70, lat: 10.78 },
  vungtau:  { name: 'Vũng Tàu',    lon: 107.08, lat: 10.40, dc: -2 },   // coastal
  cantho:   { name: 'Cần Thơ',     lon: 105.78, lat: 10.03 },
  phuquoc:  { name: 'Phú Quốc',    lon: 103.99, lat: 10.29, dr: -1 },   // island: pin onto island pixel
};

function cityCoords(grid) {
  const out = {};
  for (const [k, c] of Object.entries(CITIES)) {
    out[k] = {
      name: c.name,
      col: Math.round((c.lon - BOUNDS.lonMin) / grid.cell - 0.5) + (c.dc || 0),
      row: Math.round((BOUNDS.latMax - c.lat) / grid.cell - 0.5) + (c.dr || 0),
    };
  }
  return out;
}

const coarse = rasterize(32);
const fine = rasterize(48);

// ASCII preview to eyeball the shape
console.log('=== 32 x ' + coarse.rows + ' ===');
console.log(coarse.lines.join('\n'));

const out = {
  bounds: BOUNDS,
  coarse: { cols: coarse.cols, rows: coarse.rows, cell: coarse.cell, map: coarse.lines },
  fine: { cols: fine.cols, rows: fine.rows, cell: fine.cell, map: fine.lines },
  citiesCoarse: cityCoords(coarse),
  citiesFine: cityCoords(fine),
};
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'vnmap.json'), JSON.stringify(out, null, 1));
console.error('Wrote assets/vnmap.json');

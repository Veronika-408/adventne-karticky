/* Generátor adventných kartičiek – prototyp (v0) */
const $ = s => document.querySelector(s);
const DNI = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
const ROZLOZENIE = { 4: [2, 2], 6: [2, 3], 8: [2, 4] };

let seed = Math.floor(Math.random() * 1e9);

/* Opakovateľný náhodný generátor (mulberry32) */
function rng(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function zamiesaj(pole, r) {
  const a = pole.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Prototyp ešte nepozná pohlavie: „želal(a)“ */
function tvar(text) {
  return text.replace(/\{([^|}]*)\|([^}]*)\}/g, (_, m, f) => f.startsWith(m) ? `${m}(${f.slice(m.length)})` : `${m}/${f}`);
}
function textUlohy(u, vek) { return typeof u.x === 'string' ? u.x : (u.x[vek] || u.x.s || Object.values(u.x)[0]); }

function nastavenia() {
  const f = $('#form');
  return {
    meno: f.meno.value.trim(),
    vek: f.vek.value,
    zaciatok: f.zaciatok.value,
    pocet: Math.max(1, Math.min(40, +f.pocet.value || 24)),
    tlac: f.tlac.value,
    naStranu: +f.naStranu.value,
    kategorie: [...f.querySelectorAll('[name=kat]:checked')].map(i => i.value),
  };
}

function generuj() {
  const n = nastavenia();
  const r = rng(seed);
  const pool = zamiesaj(ULOHY.filter(u => u.a.includes(n.vek) && n.kategorie.includes(u.c) && !u.d), r);
  const start = new Date(n.zaciatok + 'T12:00:00');
  const dni = [];
  for (let i = 0; i < n.pocet; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    dni.push({ cislo: i + 1, datum: d, uloha: pool.length ? pool[i % pool.length] : null });
  }
  vykresli(dni, n);
}

function karta(den, n) {
  const u = den.uloha;
  const kat = u ? KATEGORIE[u.c] : null;
  const d = den.datum;
  return `<article class="card" style="--c:${kat ? kat.farba : '#888'}">
    <div class="frame"></div>
    <div class="card-top"><span class="num">${den.cislo}</span>
      <span class="date">${d.getDate()}. ${d.getMonth() + 1}.<small>${DNI[d.getDay()]}</small></span></div>
    <div class="art">${u ? kresba(u.i || kat.ikona, n.tlac) : ''}</div>
    <div class="title">${u ? esc(u.t) : 'Vyber aspoň jeden druh úloh'}</div>
    <div class="text">${u ? esc(tvar(textUlohy(u, n.vek))) : ''}</div>
  </article>`;
}

function vykresli(dni, n) {
  const [cols, rows] = ROZLOZENIE[n.naStranu];
  const per = cols * rows;
  let html = '';
  for (let i = 0; i < dni.length; i += per) {
    html += `<section class="sheet n${n.naStranu}">${dni.slice(i, i + per).map(d => karta(d, n)).join('')}</section>`;
  }
  const sheets = $('#sheets');
  sheets.innerHTML = html;
  sheets.classList.toggle('bw', n.tlac === 'cb');
  $('#info').textContent = `${dni.length} kartičiek · ${Math.ceil(dni.length / per)} ${Math.ceil(dni.length / per) === 1 ? 'strana' : 'strany'} A4`;
  prisposobZoom();
}

/* Náhľad A4 sa zmenší, aby sa zmestil do okna */
function prisposobZoom() {
  const w = $('.preview').clientWidth - 48;
  const a4 = 210 * 96 / 25.4;
  $('#sheets').style.setProperty('--zoom', Math.min(1, w / a4).toFixed(3));
}

function init() {
  const f = $('#form');
  f.zaciatok.value = `${new Date().getFullYear()}-12-01`;
  $('#kategorie').innerHTML = Object.entries(KATEGORIE).map(([k, v]) =>
    `<label class="chip"><input type="checkbox" name="kat" value="${k}" checked><span class="dot" style="background:${v.farba}"></span>${v.nazov}</label>`).join('');
  f.addEventListener('input', generuj);
  f.addEventListener('change', generuj);
  $('#zamiesat').addEventListener('click', () => { seed = Math.floor(Math.random() * 1e9); generuj(); });
  $('#tlacit').addEventListener('click', () => window.print());
  window.addEventListener('resize', prisposobZoom);
  generuj();
}
init();

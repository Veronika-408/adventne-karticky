/* Generátor adventných kartičiek – v1 */
const $ = s => document.querySelector(s);
const DNI = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
const ROZLOZENIE = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 12: [3, 4] };
const KLUC = 'adventne-karticky';
const MAX_V_TYZDNI = 30; // minút

let stav = { seed: Math.floor(Math.random() * 1e9), vymeny: {}, upravy: {} };
let posledneDni = [];

/* ---------- pomocné ---------- */
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
const pad = n => String(n).padStart(2, '0');
const mmdd = d => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const jeVikend = d => d.getDay() === 0 || d.getDay() === 6;
const dlha = u => u.w || (u.n || 0) > MAX_V_TYZDNI;

/* {chlapec|dievča} → podľa pohlavia, inak „želal(a)“ */
function tvar(text, pohlavie) {
  return text.replace(/\{([^|}]*)\|([^}]*)\}/g, (_, m, f) => {
    if (pohlavie === 'm') return m;
    if (pohlavie === 'f') return f;
    return f.startsWith(m) ? `${m}(${f.slice(m.length)})` : `${m}/${f}`;
  });
}
function textUlohy(u, vek) { return typeof u.x === 'string' ? u.x : (u.x[vek] || u.x.s || Object.values(u.x)[0]); }

/* Adventné nedele daného roku → { 'MM-DD': poradie } */
function adventneNedele(rok) {
  const vianoce = new Date(rok, 11, 24, 12);
  const stvrta = new Date(rok, 11, 24 - vianoce.getDay(), 12);
  const out = {};
  for (let k = 0; k < 4; k++) { const d = new Date(stvrta); d.setDate(stvrta.getDate() - 7 * k); out[mmdd(d)] = 4 - k; }
  return out;
}

/* ---------- formulár a ukladanie ---------- */
function citajFormular() {
  const f = $('#form'), data = {};
  for (const el of f.elements) {
    if (!el.name) continue;
    if (el.type === 'checkbox' && el.name === 'kat') (data.kat ||= []).push(...(el.checked ? [el.value] : []));
    else if (el.type === 'checkbox') data[el.name] = el.checked;
    else if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
    else data[el.name] = el.value;
  }
  data.kat ||= [];
  return data;
}
function vyplnFormular(data) {
  const f = $('#form');
  for (const el of f.elements) {
    if (!el.name || !(el.name in data)) continue;
    if (el.name === 'kat') el.checked = data.kat.includes(el.value);
    else if (el.type === 'checkbox') el.checked = !!data[el.name];
    else if (el.type === 'radio') el.checked = data[el.name] === el.value;
    else el.value = data[el.name];
  }
}
function uloz() { try { localStorage.setItem(KLUC, JSON.stringify({ form: citajFormular(), stav })); } catch (e) { /* bez úložiska */ } }
function nacitaj() { try { return JSON.parse(localStorage.getItem(KLUC)); } catch (e) { return null; } }

function nastavenia() {
  const d = citajFormular();
  return {
    meno: (d.meno || '').trim(),
    pohlavie: d.pohlavie,
    vek: d.vek,
    zaciatok: d.zaciatok,
    pocet: Math.max(1, Math.min(40, +d.pocet || 24)),
    tlac: d.tlac,
    farby: d.farby,
    naStranu: +d.naStranu,
    strihanie: d.strihanie,
    poklad: d.poklad,
    kategorie: d.kat,
  };
}

/* ---------- priradenie úloh ku dňom ---------- */
function vhodneUlohy(n) {
  return ULOHY.map((u, id) => ({ ...u, id })).filter(u => u.a.includes(n.vek) && n.kategorie.includes(u.c));
}

function priradenie(n) {
  const r = rng(stav.seed);
  const vhodne = vhodneUlohy(n);
  const datumove = vhodne.filter(u => u.d);
  const volne = zamiesaj(vhodne.filter(u => !u.d), r);
  const vikendove = volne.filter(dlha), tyzdnove = volne.filter(u => !dlha(u));
  const pouzite = new Set();
  const tradicie = n.kategorie.includes('tradicie');

  const start = new Date(n.zaciatok + 'T12:00:00');
  const dni = [];
  for (let i = 0; i < n.pocet; i++) {
    const datum = new Date(start); datum.setDate(start.getDate() + i);
    const den = { i, cislo: i + 1, datum, uloha: null, navyse: '' };
    const pevna = datumove.find(u => u.d === mmdd(datum));
    const advent = adventneNedele(datum.getFullYear())[mmdd(datum)];
    if (pevna) { den.uloha = pevna; pouzite.add(pevna.id); }
    if (advent && tradicie) {
      if (den.uloha) den.navyse = `Večer zapáľte ${advent}. sviečku na adventnom venci.`;
      else den.uloha = { ...SPECIALNE.nedela, id: 'nedela', t: SPECIALNE.nedela.t.replace('{n}', advent), x: SPECIALNE.nedela.x.replace('{n}', advent) };
    }
    if (!den.uloha && i === n.pocet - 1 && n.poklad) den.uloha = { ...SPECIALNE.posledna, id: 'posledna' };
    dni.push(den);
  }

  const vyber = (zoznam) => zoznam.find(u => !pouzite.has(u.id));
  for (const den of dni) {
    if (den.uloha) continue;
    const vikend = jeVikend(den.datum);
    let u = vikend ? (vyber(vikendove) || vyber(tyzdnove)) : (vyber(tyzdnove) || vyber(vikendove));
    if (!u) { pouzite.clear(); dni.forEach(d => d.uloha && pouzite.add(d.uloha.id)); u = vyber(vikend ? vikendove : tyzdnove) || volne[den.i % Math.max(1, volne.length)]; }
    if (u) { den.uloha = u; pouzite.add(u.id); }
  }

  // ručné výmeny z náhľadu
  for (const den of dni) {
    const id = stav.vymeny[den.i];
    if (id == null) continue;
    const u = vhodne.find(v => v.id === id);
    if (u) den.uloha = u;
  }
  return dni;
}

/* Iná úloha pre jeden deň */
function vymen(i) {
  const n = nastavenia();
  const den = posledneDni[i];
  const pouzite = new Set(posledneDni.map(d => d.uloha && d.uloha.id));
  const kandidati = vhodneUlohy(n).filter(u => !u.d && !pouzite.has(u.id));
  const vikend = jeVikend(den.datum);
  const vhodni = kandidati.filter(u => vikend || !dlha(u));
  const zoznam = vhodni.length ? vhodni : kandidati;
  if (!zoznam.length) return;
  stav.vymeny[i] = zoznam[Math.floor(Math.random() * zoznam.length)].id;
  delete stav.upravy[i];
  generuj();
}

/* ---------- vykreslenie ---------- */
function karta(den, n) {
  const u = den.uloha;
  const kat = u ? KATEGORIE[u.c] : null;
  const d = den.datum;
  const uprava = stav.upravy[den.i] || {};
  const povNadpis = u ? tvar(u.t, n.pohlavie) : 'Vyber aspoň jeden druh úloh';
  const povText = u ? tvar(textUlohy(u, n.vek), n.pohlavie) : '';
  const nadpis = uprava.t ?? povNadpis;
  const text = uprava.x ?? povText;
  const sDospelym = u && u.e && n.vek !== 'm' ? '<span class="badge">s dospelým</span>' : '';
  const cb = n.tlac === 'cb';
  return `<article class="card" style="--c:${cb ? '#1a1a1a' : kat ? kat.farba : '#888'}" data-i="${den.i}">
    <div class="frame"></div>
    <div class="card-top"><span class="num">${den.cislo}</span>
      <span class="date">${d.getDate()}. ${d.getMonth() + 1}.<small>${DNI[d.getDay()]}</small></span>${sDospelym}</div>
    <div class="art">${u ? kresba(u.i || kat.ikona, n.tlac) : ''}${cb && u ? '<span class="color-me">vymaľuj ma</span>' : ''}</div>
    <div class="title" contenteditable="true" spellcheck="false" data-f="t" data-o="${esc(povNadpis)}">${esc(nadpis)}</div>
    <div class="text" contenteditable="true" spellcheck="false" data-f="x" data-o="${esc(povText)}">${esc(text)}</div>
    ${den.navyse ? `<div class="extra">${esc(den.navyse)}</div>` : ''}
    ${n.meno ? `<div class="for">${esc(n.meno)}</div>` : ''}
    <div class="tools"><button type="button" data-vymen="${den.i}" title="Vybrať inú úlohu na tento deň">Iná úloha</button></div>
  </article>`;
}

function generuj() {
  const n = nastavenia();
  document.body.classList.toggle('tlac-cb', n.tlac === 'cb');
  posledneDni = priradenie(n);
  const [cols, rows] = ROZLOZENIE[n.naStranu];
  const per = cols * rows;
  let html = '';
  for (let i = 0; i < posledneDni.length; i += per) {
    html += `<section class="sheet n${n.naStranu}">${posledneDni.slice(i, i + per).map(d => karta(d, n)).join('')}</section>`;
  }
  const sheets = $('#sheets');
  sheets.innerHTML = html;
  sheets.className = `sheets vek-${n.vek} ${n.tlac === 'cb' ? 'bw' : ''} ${n.tlac === 'farba' && n.farby === 'setrne' ? 'setrne' : ''} cut-${n.strihanie}`;

  const strany = Math.ceil(posledneDni.length / per);
  const upravene = Object.keys(stav.upravy).length + Object.keys(stav.vymeny).length;
  $('#info').innerHTML = `${posledneDni.length} kartičiek · ${strany} ${strany === 1 ? 'strana' : strany < 5 ? 'strany' : 'strán'} A4`
    + ` · <span class="hint">Kliknutím na text ho upravíš.</span>`
    + (upravene ? ` · <button type="button" class="link" id="zrusUpravy">Zrušiť moje úpravy (${upravene})</button>` : '');
  prisposobZoom();
  uloz();
}

function prisposobZoom() {
  const w = $('.preview').clientWidth - 48;
  const a4 = 210 * 96 / 25.4;
  $('#sheets').style.setProperty('--zoom', Math.min(1, w / a4).toFixed(3));
}

/* ---------- štart ---------- */
function init() {
  const f = $('#form');
  f.zaciatok.value = `${new Date().getFullYear()}-12-01`;
  $('#kategorie').innerHTML = Object.entries(KATEGORIE).map(([k, v]) =>
    `<label class="chip"><input type="checkbox" name="kat" value="${k}" checked><span class="dot" style="background:${v.farba}"></span>${v.nazov}</label>`).join('');

  const ulozene = nacitaj();
  if (ulozene) { vyplnFormular(ulozene.form || {}); stav = { ...stav, ...(ulozene.stav || {}) }; }

  f.addEventListener('change', generuj);
  f.addEventListener('input', e => { if (e.target.type === 'text' || e.target.type === 'number') generuj(); });
  $('#zamiesat').addEventListener('click', () => { stav = { seed: Math.floor(Math.random() * 1e9), vymeny: {}, upravy: {} }; generuj(); });
  $('#tlacit').addEventListener('click', () => window.print());

  const sheets = $('#sheets');
  sheets.addEventListener('click', e => {
    const b = e.target.closest('[data-vymen]');
    if (b) vymen(+b.dataset.vymen);
  });
  sheets.addEventListener('focusout', e => {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    const i = +el.closest('.card').dataset.i;
    const hodnota = el.textContent.trim();
    const u = { ...(stav.upravy[i] || {}) };
    if (hodnota === el.dataset.o) delete u[el.dataset.f]; else u[el.dataset.f] = hodnota;
    if (Object.keys(u).length) stav.upravy[i] = u; else delete stav.upravy[i];
    uloz();
  });
  sheets.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest('[data-f]')) { e.preventDefault(); e.target.blur(); } });
  $('#info').addEventListener('click', e => { if (e.target.id === 'zrusUpravy') { stav.vymeny = {}; stav.upravy = {}; generuj(); } });
  window.addEventListener('resize', prisposobZoom);
  generuj();
}
init();

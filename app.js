/* Generátor adventných kartičiek (texty v i18n.js, data.js, data-en.js) */
const $ = s => document.querySelector(s);
const ROZLOZENIE = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 12: [3, 4] };
const KLUC = 'adventne-karticky';
const TEMY = {
  klasika: ['#b8323a', '#2f6b3a'],
  zima: ['#2f6fa8', '#4b86b8', '#1f4f7a'],
  zlato: ['#a8741a', '#8a5a2b', '#b5862a'],
};
const VLASTNA = { ikona: 'srdce', farba: '#b8323a' };

let stav = { seed: novySeed(), vymeny: {}, upravy: {}, zamky: {} };
let sady = [];   // [{ dieta, k, dni }]

/* ---------- pomocné ---------- */
function novySeed() { return Math.floor(Math.random() * 2176782335); }
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
const kratkyDatum = d => T().datum(d);
const kat = u => (u.c === 'vlastne' ? VLASTNA : KATEGORIE[u.c]);
const nazovKat = c => c === 'vlastne' ? T().mojaUloha : JAZYK === 'en' ? (KATEGORIE_EN[c] || c) : (KATEGORIE[c] ? KATEGORIE[c].nazov : c);

function tvar(text, pohlavie) {
  return text.replace(/\{([^|}]*)\|([^}]*)\}/g, (_, m, f) => {
    if (pohlavie === 'm') return m;
    if (pohlavie === 'f') return f;
    return f.startsWith(m) ? `${m}(${f.slice(m.length)})` : `${m}/${f}`;
  });
}
const pohyblive = u => u && !u.d && (typeof u.id === 'number' || String(u.id).startsWith('v'));
function doVianoc(d) {
  const dni = Math.round((new Date(d.getFullYear(), 11, 24, 12) - d) / 864e5);
  if (dni < 0 || dni > 40) return '';
  return T().doVianoc(dni);
}
/* „1-6, 9“ → Set čísel, prázdne = všetko */
function parsujVyber(text) {
  const out = new Set();
  for (const cast of String(text || '').split(/[,;\s]+/).filter(Boolean)) {
    const m = cast.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = +m[1], b = m[2] ? +m[2] : a;
    for (let x = Math.min(a, b); x <= Math.max(a, b) && x <= 60; x++) out.add(x);
  }
  return out.size ? out : null;
}
function textUlohy(u, vek) { return typeof u.x === 'string' ? u.x : (u.x[vek] || u.x.s || Object.values(u.x)[0]); }

function adventneNedele(rok) {
  const vianoce = new Date(rok, 11, 24, 12);
  const stvrta = new Date(rok, 11, 24 - vianoce.getDay(), 12);
  const out = {};
  for (let k = 0; k < 4; k++) { const d = new Date(stvrta); d.setDate(stvrta.getDate() - 7 * k); out[mmdd(d)] = 4 - k; }
  return out;
}

/* ---------- deti ---------- */
function riadokDietata(d, k) {
  const opt = (obj, v) => Object.entries(obj).map(([a, b]) => `<option value="${a}"${a === v ? ' selected' : ''}>${b}</option>`).join('');
  const t = T();
  return `<div class="dieta" data-k="${k}">
    <input type="text" id="meno-${k}" data-p="meno" placeholder="${esc(t.menoPh)}" value="${esc(d.meno || '')}" aria-label="${esc(t.menoAria)}">
    <select id="vek-${k}" data-p="vek" aria-label="${esc(t.vekAria)}">${opt(t.veky, d.vek || 's')}</select>
    <select id="pohlavie-${k}" data-p="pohlavie" aria-label="${esc(t.oslAria)}">${opt(t.oslovenie, d.pohlavie || 'n')}</select>
    ${k > 0 ? `<button type="button" class="x" data-odober="${k}" aria-label="${esc(t.odober)}">×</button>` : ''}
  </div>`;
}
function vykresliDeti(deti) {
  $('#deti').innerHTML = deti.map(riadokDietata).join('');
  document.body.classList.toggle('viac-deti', deti.length > 1);
}
function citajDeti() {
  return [...document.querySelectorAll('#deti .dieta')].map(r => {
    const d = {};
    r.querySelectorAll('[data-p]').forEach(el => { d[el.dataset.p] = el.value; });
    d.meno = d.meno.trim();
    return d;
  });
}

/* ---------- formulár a ukladanie ---------- */
function citajFormular() {
  const f = $('#form'), data = { kat: [] };
  for (const el of f.elements) {
    if (!el.name) continue;
    if (el.name === 'kat') { if (el.checked) data.kat.push(el.value); }
    else if (el.type === 'checkbox') data[el.name] = el.checked;
    else if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
    else data[el.name] = el.value;
  }
  data.deti = citajDeti();
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
  if (data.podpis && STARE_PODPISY[data.podpis]) f.podpis.value = STARE_PODPISY[data.podpis];
  // staršie uložené nastavenia mali jedno dieťa priamo vo formulári
  const deti = data.deti || [{ meno: data.meno || '', vek: data.vek || 's', pohlavie: data.pohlavie || 'n' }];
  vykresliDeti(deti);
}
function uloz() { try { localStorage.setItem(KLUC, JSON.stringify({ form: citajFormular(), stav })); } catch (e) { /* bez úložiska */ } }
function nacitaj() { try { return JSON.parse(localStorage.getItem(KLUC)); } catch (e) { return null; } }

function nastavenia() {
  const d = citajFormular();
  return {
    deti: d.deti.length ? d.deti : [{ meno: '', vek: 's', pohlavie: 'n' }],
    spolocne: d.spolocne && d.deti.length > 1,
    zaciatok: d.zaciatok,
    pocet: Math.max(1, Math.min(40, +d.pocet || 24)),
    maxMin: +d.maxMin || 30,
    poklad: d.poklad,
    kategorie: d.kat,
    bezNab: d.bezNab, bezVon: d.bezVon, bezPenazi: d.bezPenazi,
    vlastne: d.vlastne || '',
    jazyk: d.jazyk === 'en' ? 'en' : 'sk',
    podpis: d.podpis === '*' ? (d.podpisVlastny || '').trim() : (STR[d.jazyk === 'en' ? 'en' : 'sk'].podpisy[d.podpis] || ''),
    podpisVlastny: d.podpis === '*',
    tlac: d.tlac, farby: d.farby, tema: d.tema,
    naStranu: +d.naStranu, strihanie: d.strihanie,
    cas: d.cas, zadne: d.zadne, prehlad: d.prehlad, stitky: d.stitky,
    pocitanie: d.pocitanie, tlacene: d.tlacene, hadanky: d.hadanky, vyzvy: d.vyzvy, splnene: d.splnene,
    pismo: d.pismo || 'zaoblene',
    odpocet: d.odpocet, titulka: d.titulka, vyber: parsujVyber(d.vyber),
  };
}

/* „6.12. Nadpis | text“ → úloha */
function vlastneUlohy(text) {
  return text.split('\n').map(s => s.trim()).filter(Boolean).map((riadok, j) => {
    const u = { c: 'vlastne', a: 'msv', i: 'srdce', id: 'v' + j, t: T().mojaUloha, bezNadpisu: true };
    const m = riadok.match(/^(\d{1,2})\.\s*(\d{1,2})\.?\s+(.*)$/);
    if (m) { u.d = `${pad(m[2])}-${pad(m[1])}`; riadok = m[3]; }
    const [a, b] = riadok.split('|').map(s => s.trim());
    if (b) { u.t = a; u.x = b; u.bezNadpisu = false; } else u.x = a;
    return u;
  });
}

/* ---------- priradenie úloh ku dňom ---------- */
function vhodneUlohy(n, veky) {
  return ULOHY.map((u, id) => ({ ...u, ...(JAZYK === 'en' ? ULOHY_EN[id] : {}), id }))
    .filter(u => veky.every(v => u.a.includes(v)) && n.kategorie.includes(u.c))
    .filter(u => !(n.bezNab && u.r) && !(n.bezVon && u.o) && !(n.bezPenazi && u.k));
}

function priradenie(n, veky, seed, klucSady) {
  const r = rng(seed);
  const dlha = u => u.w || (u.n || 0) > n.maxMin;
  const vhodne = vhodneUlohy(n, veky);
  const vlastne = vlastneUlohy(n.vlastne);
  const datumove = [...vlastne.filter(u => u.d), ...vhodne.filter(u => u.d)];
  const volne = zamiesaj(vhodne.filter(u => !u.d), r);
  const vikendove = volne.filter(dlha), tyzdnove = volne.filter(u => !dlha(u));
  const pouzite = new Set();
  const tradicie = n.kategorie.includes('tradicie');

  const start = new Date(n.zaciatok + 'T12:00:00');
  const dni = [];
  for (let i = 0; i < n.pocet; i++) {
    const datum = new Date(start); datum.setDate(start.getDate() + i);
    const den = { i, cislo: i + 1, datum, uloha: null, navyse: '' };
    const pevna = datumove.find(u => u.d === mmdd(datum) && !pouzite.has(u.id));
    const advent = adventneNedele(datum.getFullYear())[mmdd(datum)];
    if (pevna) { den.uloha = pevna; pouzite.add(pevna.id); }
    if (advent && tradicie) {
      const en = JAZYK === 'en';
      const ned = en ? { ...SPECIALNE.nedela, ...SPECIALNE_EN.nedela } : SPECIALNE.nedela;
      if (den.uloha) den.navyse = T().adventNavyse(advent);
      else den.uloha = { ...ned, id: 'nedela', t: ned.t.replace('{n}', T().poradie(advent)), x: ned.x.replace('{n}', en ? PORADIE_EN[advent] : advent) };
    }
    if (!den.uloha && i === n.pocet - 1 && n.poklad) den.uloha = { ...SPECIALNE.posledna, ...(JAZYK === 'en' ? SPECIALNE_EN.posledna : {}), id: 'posledna' };
    dni.push(den);
  }

  // vlastné úlohy bez dátumu padnú na náhodné voľné dni
  const volneDni = zamiesaj(dni.filter(d => !d.uloha), r);
  vlastne.filter(u => !u.d).forEach((u, j) => { if (volneDni[j]) volneDni[j].uloha = u; });

  // vyvážené poradie: susedné dni nemajú rovnaký druh úlohy, ak sa to dá
  const vyber = (zoznam, zakazane) => zoznam.find(u => !pouzite.has(u.id) && !zakazane.has(u.c)) || zoznam.find(u => !pouzite.has(u.id));
  for (const den of dni) {
    if (den.uloha) continue;
    const susedia = new Set([dni[den.i - 1], dni[den.i + 1]].filter(d => d && d.uloha).map(d => d.uloha.c));
    const vikend = jeVikend(den.datum);
    let u = vikend ? (vyber(vikendove, susedia) || vyber(tyzdnove, susedia)) : (vyber(tyzdnove, susedia) || vyber(vikendove, susedia));
    if (!u) { // úlohy sa minuli – môžu sa opakovať
      pouzite.clear(); dni.forEach(d => d.uloha && pouzite.add(d.uloha.id));
      u = vyber(vikend ? vikendove : tyzdnove, susedia) || volne[den.i % Math.max(1, volne.length)];
    }
    if (u) { den.uloha = u; pouzite.add(u.id); }
  }

  // hádanky a výzvy navyše
  const veky0 = veky.join('');
  const en = JAZYK === 'en';
  const hadanky = zamiesaj(HADANKY.map((h, j) => en ? { ...h, ...HADANKY_EN[j] } : h).filter(h => veky.every(v => h.a.includes(v))), r);
  const vyzvy = zamiesaj(en ? VYZVY_EN : VYZVY, r);
  let h = 0, v = 0;
  for (const den of dni) {
    if (n.hadanky && !veky0.includes('m') && den.cislo % 3 === 0 && hadanky.length) den.hadanka = hadanky[h++ % hadanky.length];
    else if (n.vyzvy && veky.every(x => x === 'v') && jeVikend(den.datum)) den.vyzva = vyzvy[v++ % vyzvy.length];
  }

  // ručné výmeny, presuny a zamknuté kartičky
  const vsetky = [...vhodne, ...vlastne];
  for (const den of dni) {
    const id = stav.vymeny[`${klucSady}:${den.i}`];
    if (id == null) continue;
    const u = vsetky.find(v => v.id === id);
    if (u) den.uloha = u;
  }
  return dni;
}

function vytvorSady(n) {
  if (n.spolocne) {
    const veky = [...new Set(n.deti.map(d => d.vek))];
    const dni = priradenie(n, veky, stav.seed, 's');
    return n.deti.map((dieta, k) => ({ dieta, k, kluc: 's', dni }));
  }
  return n.deti.map((dieta, k) => ({ dieta, k, kluc: String(k), dni: priradenie(n, [dieta.vek], stav.seed + k * 7919, String(k)) }));
}

function vymen(k, i) {
  const n = nastavenia();
  const sada = sady[k];
  const den = sada.dni[i];
  const veky = n.spolocne ? [...new Set(n.deti.map(d => d.vek))] : [sada.dieta.vek];
  const pouzite = new Set(sada.dni.map(d => d.uloha && d.uloha.id));
  const kandidati = vhodneUlohy(n, veky).filter(u => !u.d && !pouzite.has(u.id));
  const vhodni = kandidati.filter(u => jeVikend(den.datum) || !(u.w || (u.n || 0) > n.maxMin));
  const zoznam = vhodni.length ? vhodni : kandidati;
  if (!zoznam.length) return;
  stav.vymeny[`${sada.kluc}:${i}`] = zoznam[Math.floor(Math.random() * zoznam.length)].id;
  delete stav.upravy[`${k}:${i}`];
  generuj();
}

/* ---------- farby ---------- */
function farbaKarty(u, den, n) {
  if (n.tlac === 'cb') return '#1a1a1a';
  if (!u) return '#888';
  const t = TEMY[n.tema];
  return t ? t[den.i % t.length] : kat(u).farba;
}

/* ---------- vykreslenie ---------- */
const HVIEZDICKA = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 14.8,8.6 22,9.2 16.5,13.9 18.2,21 12,17.2 5.8,21 7.5,13.9 2,9.2 9.2,8.6" fill="var(--star-fill)" stroke="var(--c)" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const HODINY = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

function karta(den, sada, n) {
  const u = den.uloha;
  const { dieta, k } = sada;
  const d = den.datum;
  const kluc = `${k}:${den.i}`;
  const uprava = stav.upravy[kluc] || {};
  const t = T();
  const povNadpis = u ? tvar(u.t, dieta.pohlavie) : t.ziadnaUloha;
  const povText = u ? tvar(textUlohy(u, dieta.vek), dieta.pohlavie) : '';
  const nadpis = uprava.t ?? povNadpis;
  const text = uprava.x ?? povText;
  const cb = n.tlac === 'cb';
  const znacky = [];
  if (n.cas && u && u.n) znacky.push(`<span class="badge time">${HODINY}${t.cas(u.n)}</span>`);
  if (u && u.e && dieta.vek !== 'm') znacky.push(`<span class="badge">${t.sDospelym}</span>`);
  const pata = [n.podpis && `<span class="sign">${esc(n.podpis)}</span>`].filter(Boolean);
  let hviezdy = '';
  if (n.pocitanie && dieta.vek === 'm') {
    const skupiny = [];
    for (let j = 0; j < den.cislo; j += 5) skupiny.push(`<span class="grp">${HVIEZDICKA.repeat(Math.min(5, den.cislo - j))}</span>`);
    hviezdy = `<div class="stars" title="${t.spocitaj}">${skupiny.join('')}</div>`;
  }
  const navyse = [
    den.navyse && `<div class="extra">${esc(den.navyse)}</div>`,
    den.hadanka && `<div class="riddle"><b>${t.hadanka}</b> ${esc(den.hadanka.q)}<span class="answer">${esc(den.hadanka.o)}</span></div>`,
    den.vyzva && `<div class="extra challenge"><b>${t.vyzva}</b> ${esc(den.vyzva)}</div>`,
  ].filter(Boolean).join('');
  const triedy = ['card', `vek-${dieta.vek}`, n.tlacene && dieta.vek !== 'v' ? 'tlacene' : ''].filter(Boolean).join(' ');
  return `<article class="${triedy}" style="--c:${farbaKarty(u, den, n)}" data-k="${k}" data-i="${den.i}">
    <div class="frame"></div>
    <div class="card-top"><span class="num">${den.cislo}</span>
      <span class="date">${kratkyDatum(d)}<small>${t.dni[d.getDay()]}</small>${n.odpocet ? `<small class="cd">${doVianoc(d)}</small>` : ''}</span>
      ${znacky.length ? `<span class="badges">${znacky.join('')}</span>` : ''}</div>
    <div class="body">
      <div class="title" contenteditable="true" spellcheck="false" data-f="t" data-o="${esc(povNadpis)}">${esc(nadpis)}</div>
      <div class="text" contenteditable="true" spellcheck="false" data-f="x" data-o="${esc(povText)}">${esc(text)}</div>
      ${hviezdy}${navyse}
    </div>
    <div class="art">${u ? kresba(u.i || kat(u).ikona, n.tlac) : ''}${cb && u ? `<span class="color-me">${t.vymalujMa}</span>` : ''}${n.splnene ? `<span class="done">${t.splnene}</span>` : ''}</div>
    ${pata.length ? `<div class="foot one">${pata.join('')}</div>` : ''}
    <div class="tools">
      ${pohyblive(u) ? `<button type="button" class="drag" draggable="true" data-tahaj="${k}:${den.i}" title="${t.presunTitle}" aria-label="${t.presun}">⇄</button>` : ''}
      <button type="button" data-zamok="${k}:${den.i}" class="${stav.zamky[`${k}:${den.i}`] ? 'on' : ''}" title="${t.zamokTitle}" aria-pressed="${!!stav.zamky[`${k}:${den.i}`]}">${stav.zamky[`${k}:${den.i}`] ? t.zamknuta : t.zamknut}</button>
      <button type="button" data-lupa title="${t.lupaTitle}">${t.lupa}</button>
      <button type="button" data-vymen="${k}:${den.i}" title="${t.inaTitle}">${t.ina}</button></div>
    ${stav.zamky[`${k}:${den.i}`] ? '<span class="lock-mark" aria-hidden="true"></span>' : ''}
  </article>`;
}

function zadnaKarta(den, n, i) {
  if (!den) return '<div class="card back empty"></div>';
  const t = TEMY[n.tema];
  const c = n.tlac === 'cb' ? '#1a1a1a' : t ? t[den.i % t.length] : (den.uloha ? kat(den.uloha).farba : '#b8323a');
  const vzor = ['hviezda', 'vlocka', 'stromcek', 'zvoncek', 'ozdoba'][i % 5];
  return `<div class="card back" style="--c:${c}">
    <div class="frame"></div>
    <div class="back-art">${kresba(vzor, n.tlac)}</div>
    <div class="back-num">${den.cislo}</div>
    <div class="back-date">${kratkyDatum(den.datum)}</div>
  </div>`;
}

function stranaPreRodica(sada, n) {
  const { dieta, dni } = sada;
  const t = T();
  const material = new Map();
  for (const d of dni) {
    const p = d.uloha && d.uloha.p;
    if (!p) continue;
    p.split(',').map(s => s.trim()).filter(Boolean).forEach(vec => { if (!material.has(vec)) material.set(vec, d.datum); });
  }
  const riadky = dni.map(d => {
    const u = d.uloha;
    const upr = stav.upravy[`${sada.k}:${d.i}`] || {};
    const nadpis = upr.t ?? (u ? tvar(u.bezNadpisu ? u.x : u.t, dieta.pohlavie) : '');
    const pozn = [u && u.e ? t.sDospelym : '', u && u.p ? t.pripravit + u.p : '', d.navyse].filter(Boolean).join(' · ');
    return `<tr class="${jeVikend(d.datum) ? 'we' : ''}"><td class="c">${d.cislo}</td><td>${kratkyDatum(d.datum)} ${t.dni[d.datum.getDay()].slice(0, JAZYK === 'en' ? 3 : 2)}</td>
      <td><b>${esc(nadpis)}</b>${pozn ? `<small>${esc(pozn)}</small>` : ''}</td><td class="c">${u && u.n ? u.n + '′' : ''}</td></tr>`;
  }).join('');
  const zoznam = [...material.entries()].sort((a, b) => a[1] - b[1])
    .map(([vec, d]) => `<li><span class="box"></span>${esc(vec)} <em>${t.do} ${kratkyDatum(d)}</em></li>`).join('');
  return `<section class="sheet parent${dni.length > 20 ? ' dense' : ''}">
    <h2>${t.plan}${dieta.meno ? ' – ' + esc(dieta.meno) : ''}</h2>
    <p class="sub">${t.planSub}</p>
    <table><thead><tr>${t.thead.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${riadky}</tbody></table>
    ${zoznam ? `<h3>${t.coPripravit}</h3><ul class="shop">${zoznam}</ul>` : ''}
  </section>`;
}

function harokStitkov(sada, n) {
  const naStranu = 24;
  const meno = n.spolocne ? '' : sada.dieta.meno;
  let html = '', strany = 0;
  for (let i = 0; i < sada.dni.length; i += naStranu) {
    html += `<section class="sheet labels">${sada.dni.slice(i, i + naStranu).map(d => {
      const c = farbaKarty(d.uloha, d, n);
      return `<div class="label-circle" style="--c:${c}"><span class="ln">${d.cislo}</span><span class="ld">${kratkyDatum(d.datum)}${meno ? ' · ' + esc(meno) : ''}</span></div>`;
    }).join('')}</section>`;
    strany++;
  }
  return { html, strany };
}

function vykresliStatistiku(n) {
  const riadky = (n.spolocne ? sady.slice(0, 1) : sady).map(sada => {
    const pocty = {};
    let minuty = 0, vonku = 0, dospely = 0;
    for (const d of sada.dni) {
      const u = d.uloha;
      if (!u) continue;
      pocty[u.c] = (pocty[u.c] || 0) + 1;
      minuty += u.n || 0; if (u.o) vonku++; if (u.e) dospely++;
    }
    const spolu = sada.dni.length || 1;
    const pruh = Object.entries(pocty).sort((a, b) => b[1] - a[1]).map(([c, p]) => {
      const kk = c === 'vlastne' ? VLASTNA : KATEGORIE[c] || { farba: '#999' };
      return `<span style="flex:${p};background:${kk.farba}" title="${esc(nazovKat(c))}: ${p}"></span>`;
    }).join('');
    const legenda = Object.entries(pocty).sort((a, b) => b[1] - a[1]).map(([c, p]) => {
      const kk = c === 'vlastne' ? VLASTNA : KATEGORIE[c] || { farba: '#999' };
      return `<span class="lg"><i style="background:${kk.farba}"></i>${esc(nazovKat(c))} ${p}</span>`;
    }).join('');
    const meno = n.spolocne ? T().spolocnaSada : (sada.dieta.meno || T().sada);
    return `<div class="stat-row"><div class="stat-head"><b>${esc(meno)}</b>
      <span>${T().statRiadok(Math.round(minuty / 60), vonku, dospely, Math.round(minuty / spolu))}</span></div>
      <div class="bar">${pruh}</div><div class="legend">${legenda}</div></div>`;
  });
  $('#stats').innerHTML = riadky.join('');
}

function titulka(sada, n) {
  const { dieta, dni } = sada;
  const prvy = dni[0] ? dni[0].datum : new Date();
  const posledny = dni[dni.length - 1] ? dni[dni.length - 1].datum : prvy;
  const c = n.tlac === 'cb' ? '#1a1a1a' : '#b8323a';
  const ozdoby = ['hviezda', 'vlocka', 'zvoncek', 'srdce', 'stromcek', 'ozdoba']
    .map((m, j) => `<span class="cover-orn o${j}">${kresba(m, n.tlac)}</span>`).join('');
  return `<section class="sheet cover" style="--c:${c}">
    <div class="cover-frame"></div>
    ${ozdoby}
    <div class="cover-in">
      <p class="cover-kicker">${kratkyDatum(prvy)} – ${kratkyDatum(posledny)} ${posledny.getFullYear()}</p>
      <h2 class="cover-title">${T().kalendarTitul}</h2>
      ${dieta.meno && !n.spolocne ? `<p class="cover-name">${esc(dieta.meno)}</p>` : ''}
      <div class="cover-art">${kresba('veniec', n.tlac)}</div>
      <p class="cover-text">${T().titulText(dni.length, n.poklad)}</p>
      ${n.podpis ? `<p class="cover-sign">${esc(n.podpis)}</p>` : ''}
    </div>
  </section>`;
}

/* Rady k tlači podľa aktuálnych nastavení */
function vykresliTipy(n) {
  const tipy = T().tipy(n).filter(Boolean);
  $('#tipy').innerHTML = tipy.map(t => `<li>${t}</li>`).join('');
}

function skusobnaStrana() {
  const farby = ['#d2463a', '#f2b93b', '#3f8a4b', '#4f8fc9', '#8a62b2', '#1a1a1a'];
  const sive = [10, 25, 40, 60, 80, 100];
  const t = T().test;
  return `<section class="sheet test">
    <div class="test-frame"><span>${t.ramik}</span></div>
    <h2>${t.nadpis}</h2>
    <p>${t.pravitko}</p>
    <div class="ruler">${Array.from({ length: 11 }, (_, j) => `<span style="left:${j * 10}%"><i></i>${j}</span>`).join('')}</div>
    <h3>${t.farby}</h3><div class="patches">${farby.map(f => `<span style="background:${f}"></span>`).join('')}</div>
    <h3>${t.sive}</h3><div class="patches">${sive.map(g => `<span style="background:hsl(0 0% ${100 - g}%)"><b>${g} %</b></span>`).join('')}</div>
    <p class="small">${t.pozn}</p>
  </section>`;
}

function exportuj() {
  const data = JSON.stringify({ aplikacia: 'adventne-karticky', verzia: 4, form: citajFormular(), stav }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  const meno = (citajDeti()[0]?.meno || 'sada').normalize('NFD').replace(/[^\w]+/g, '-').toLowerCase();
  a.download = `adventne-karticky-${meno}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importuj(subor) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (data.aplikacia !== 'adventne-karticky') throw new Error('nie je to záloha kartičiek');
      vyplnFormular(data.form || {});
      stav = { seed: novySeed(), vymeny: {}, upravy: {}, zamky: {}, ...(data.stav || {}) };
      generuj();
      oznam(T().zalohaOk);
    } catch (e) { oznam(T().zalohaChyba); }
  };
  r.readAsText(subor);
}
function oznam(text) {
  const el = $('#oznam');
  el.textContent = text; el.hidden = false;
  clearTimeout(oznam.t); oznam.t = setTimeout(() => { el.hidden = true; }, 3500);
}

function nastavJazyk(j) {
  JAZYK = j;
  prelozStranku();
  document.querySelectorAll('[data-kat-nazov]').forEach(el => { el.textContent = nazovKat(el.dataset.katNazov); });
  vykresliDeti(citajDeti());
}

function generuj() {
  const n = nastavenia();
  if (n.jazyk !== JAZYK) nastavJazyk(n.jazyk);
  document.body.classList.toggle('tlac-cb', n.tlac === 'cb');
  document.body.classList.toggle('podpis-vlastny', n.podpisVlastny);
  document.body.classList.toggle('viac-deti', n.deti.length > 1);
  sady = vytvorSady(n);
  const [cols, rows] = ROZLOZENIE[n.naStranu];
  const per = cols * rows;
  let html = '', strany = 0;
  for (const sada of sady) {
    const dniNaTlac = n.vyber ? sada.dni.filter(d => n.vyber.has(d.cislo)) : sada.dni;
    if (n.titulka && !n.vyber) { html += titulka(sada, n); strany++; }
    for (let i = 0; i < dniNaTlac.length; i += per) {
      const kus = dniNaTlac.slice(i, i + per);
      html += `<section class="sheet n${n.naStranu}">${kus.map(d => karta(d, sada, n)).join('')}</section>`;
      strany++;
      if (n.zadne) {
        // zrkadlovo po riadkoch, aby zadná strana sedela pri otáčaní cez dlhú hranu
        const sloty = Array.from({ length: per }, (_, j) => kus[j] || null);
        const zrkadlo = [];
        for (let rI = 0; rI < rows; rI++) zrkadlo.push(...sloty.slice(rI * cols, rI * cols + cols).reverse());
        html += `<section class="sheet n${n.naStranu} backs">${zrkadlo.map((d, j) => zadnaKarta(d, n, j)).join('')}</section>`;
        strany++;
      }
    }
    if (n.prehlad && !n.vyber) { html += stranaPreRodica(sada, n); strany++; }
    if (n.stitky && (!n.spolocne || sada.k === 0)) { const s = harokStitkov({ ...sada, dni: dniNaTlac }, n); html += s.html; strany += s.strany; }
  }
  const sheets = $('#sheets');
  sheets.innerHTML = html;
  sheets.className = `sheets ${n.tlac === 'cb' ? 'bw' : ''} ${n.tlac === 'farba' && n.farby === 'setrne' ? 'setrne' : ''} cut-${n.strihanie} pismo-${n.pismo}`;
  vykresliStatistiku(n);

  const upravene = Object.keys(stav.upravy).length + Object.keys(stav.vymeny).length + Object.keys(stav.zamky).length;
  const kod = stav.seed.toString(36).toUpperCase();
  vykresliTipy(n);
  const pocetKariet = n.vyber ? sady.reduce((s, x) => s + x.dni.filter(d => n.vyber.has(d.cislo)).length, 0) : sady.reduce((s, x) => s + x.dni.length, 0);
  const t = T();
  $('#info').innerHTML = (n.vyber ? `<b>${t.lenVybrane}</b> · ` : '') + t.info(pocetKariet, strany)
    + ` · ${t.kodSady} <b class="code">${kod}</b>`
    + ` · <span class="hint">${t.hint}</span>`
    + (upravene ? ` · <button type="button" class="link" id="zrusUpravy">${t.zrus(upravene)}</button>` : '');
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
    `<label class="chip"><input type="checkbox" name="kat" value="${k}" checked><span class="dot" style="background:${v.farba}"></span><span data-kat-nazov="${k}">${v.nazov}</span></label>`).join('');
  // jazyk: uložený, inak podľa prehliadača
  $(`#jazyk-${/^(sk|cs)/i.test(navigator.language || '') ? 'sk' : 'en'}`).checked = true;
  vykresliDeti([{ meno: '', vek: 's', pohlavie: 'n' }]);

  const ulozene = nacitaj();
  if (ulozene) {
    vyplnFormular(ulozene.form || {});
    stav = { ...stav, ...(ulozene.stav || {}) };
    stav.zamky ||= {};
    for (const m of ['vymeny', 'upravy']) for (const key of Object.keys(stav[m])) if (!key.includes(':')) delete stav[m][key];
  }

  f.addEventListener('change', generuj);
  // prepínač jazyka je v hlavičke mimo formulára, zmena k formuláru nedobublá
  document.querySelectorAll('input[name=jazyk]').forEach(el => el.addEventListener('change', generuj));
  f.addEventListener('input', e => { if (e.target.matches('input[type=text], input[type=number], textarea') && e.target.id !== 'kodVstup') generuj(); });
  $('#pridajDieta').addEventListener('click', () => {
    const deti = citajDeti();
    deti.push({ meno: '', vek: deti[deti.length - 1]?.vek || 's', pohlavie: 'n' });
    vykresliDeti(deti); generuj();
    $(`#meno-${deti.length - 1}`).focus();
  });
  $('#deti').addEventListener('click', e => {
    const b = e.target.closest('[data-odober]');
    if (!b) return;
    const deti = citajDeti(); deti.splice(+b.dataset.odober, 1);
    stav.vymeny = {}; stav.upravy = {}; stav.zamky = {};
    vykresliDeti(deti); generuj();
  });
  $('#zamiesat').addEventListener('click', () => {
    // zamknuté kartičky si nechajú svoju úlohu aj úpravy
    const n = nastavenia(), vymeny = {}, upravy = {};
    for (const kl of Object.keys(stav.zamky)) {
      const [k, i] = kl.split(':');
      const vk = `${n.spolocne ? 's' : k}:${i}`;
      if (vk in stav.vymeny) vymeny[vk] = stav.vymeny[vk];
      if (kl in stav.upravy) upravy[kl] = stav.upravy[kl];
    }
    stav = { seed: novySeed(), vymeny, upravy, zamky: stav.zamky };
    generuj();
  });
  $('#nacitajKod').addEventListener('click', () => {
    const s = parseInt($('#kodVstup').value.trim(), 36);
    if (!Number.isFinite(s)) { $('#kodVstup').setCustomValidity(T().kodChyba); $('#kodVstup').reportValidity(); return; }
    $('#kodVstup').setCustomValidity('');
    stav = { seed: s, vymeny: {}, upravy: {}, zamky: {} }; generuj();
  });
  $('#tlacit').addEventListener('click', () => window.print());
  $('#tlacTest').addEventListener('click', () => {
    $('#testSheet').innerHTML = skusobnaStrana();
    document.body.classList.add('tlac-test');
    window.print();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('tlac-test'));
  $('#export').addEventListener('click', exportuj);
  $('#import').addEventListener('click', () => $('#importSubor').click());
  $('#importSubor').addEventListener('change', e => { if (e.target.files[0]) importuj(e.target.files[0]); e.target.value = ''; });

  const sheets = $('#sheets');
  sheets.addEventListener('click', e => {
    const b = e.target.closest('[data-vymen]');
    if (b) { const [k, i] = b.dataset.vymen.split(':').map(Number); vymen(k, i); return; }
    const l = e.target.closest('[data-lupa]');
    if (l) {
      const card = l.closest('.card');
      const sheet = card.closest('.sheet');
      const klon = card.cloneNode(true);
      klon.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
      klon.querySelector('.tools')?.remove();
      $('#lupaObsah').className = `lupa-obsah ${sheets.className} `;
      $('#lupaObsah').innerHTML = `<div class="${sheet.className} lupa-sheet" style="width:${card.offsetWidth}px;height:${card.offsetHeight}px">${klon.outerHTML}</div>`;
      $('#lupa').showModal();
    }
  });
  // zámok
  sheets.addEventListener('click', e => {
    const z = e.target.closest('[data-zamok]');
    if (!z) return;
    const kl = z.dataset.zamok;
    const [k, i] = kl.split(':').map(Number);
    if (stav.zamky[kl]) delete stav.zamky[kl];
    else {
      stav.zamky[kl] = true;
      const u = sady[k].dni[i].uloha;
      if (pohyblive(u)) stav.vymeny[`${sady[k].kluc}:${i}`] = u.id;
    }
    generuj();
  });
  // presúvanie: potiahni ⇄ na inú kartičku toho istého dieťaťa
  let tahana = null;
  sheets.addEventListener('dragstart', e => {
    const h = e.target.closest('[data-tahaj]');
    if (!h) return;
    tahana = h.dataset.tahaj;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tahana);
    const card = h.closest('.card');
    e.dataTransfer.setDragImage(card, 30, 30);
    card.classList.add('dragging');
  });
  sheets.addEventListener('dragover', e => {
    const c = e.target.closest('.card[data-k]');
    if (!tahana || !c || c.dataset.k !== tahana.split(':')[0]) return;
    e.preventDefault();
    sheets.querySelectorAll('.drop').forEach(x => x !== c && x.classList.remove('drop'));
    c.classList.add('drop');
  });
  sheets.addEventListener('dragend', () => { tahana = null; sheets.querySelectorAll('.drop, .dragging').forEach(x => x.classList.remove('drop', 'dragging')); });
  sheets.addEventListener('drop', e => {
    const c = e.target.closest('.card[data-k]');
    if (!tahana || !c) return;
    e.preventDefault();
    const [k, a] = tahana.split(':').map(Number);
    const b = +c.dataset.i;
    tahana = null;
    if (+c.dataset.k !== k || a === b) return generuj();
    const sada = sady[k];
    const ua = sada.dni[a].uloha, ub = sada.dni[b].uloha;
    if (!pohyblive(ub)) { oznam(T().sviatokPresun); return generuj(); }
    stav.vymeny[`${sada.kluc}:${a}`] = ub.id;
    stav.vymeny[`${sada.kluc}:${b}`] = ua.id;
    const ka = `${k}:${a}`, kb = `${k}:${b}`;
    const upa = stav.upravy[ka], upb = stav.upravy[kb];
    delete stav.upravy[ka]; delete stav.upravy[kb];
    if (upa) stav.upravy[kb] = upa;
    if (upb) stav.upravy[ka] = upb;
    generuj();
  });
  $('#lupaZavri').addEventListener('click', () => $('#lupa').close());
  $('#lupa').addEventListener('click', e => { if (e.target.id === 'lupa') $('#lupa').close(); });
  sheets.addEventListener('focusout', e => {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    const card = el.closest('.card');
    const kluc = `${card.dataset.k}:${card.dataset.i}`;
    const hodnota = el.textContent.trim();
    const u = { ...(stav.upravy[kluc] || {}) };
    if (hodnota === el.dataset.o) delete u[el.dataset.f]; else u[el.dataset.f] = hodnota;
    if (Object.keys(u).length) stav.upravy[kluc] = u; else delete stav.upravy[kluc];
    uloz();
  });
  sheets.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest('[data-f]')) { e.preventDefault(); e.target.blur(); } });
  $('#info').addEventListener('click', e => { if (e.target.id === 'zrusUpravy') { stav.vymeny = {}; stav.upravy = {}; stav.zamky = {}; generuj(); } });
  window.addEventListener('resize', prisposobZoom);
  generuj();
}
init();

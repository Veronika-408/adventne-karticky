/* Generátor adventných kartičiek – v2 */
const $ = s => document.querySelector(s);
const DNI = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
const ROZLOZENIE = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 12: [3, 4] };
const KLUC = 'adventne-karticky';
const VEKY = { m: '3 – 5 rokov', s: '6 – 8 rokov', v: '9 – 12 rokov' };
const OSLOVENIE = { f: 'dievča', m: 'chlapec', n: 'neuvádzať' };
const TEMY = {
  klasika: ['#b8323a', '#2f6b3a'],
  zima: ['#2f6fa8', '#4b86b8', '#1f4f7a'],
  zlato: ['#a8741a', '#8a5a2b', '#b5862a'],
};
const VLASTNA = { nazov: 'Moja úloha', ikona: 'srdce', farba: '#b8323a' };

let stav = { seed: novySeed(), vymeny: {}, upravy: {} };
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
const kratkyDatum = d => `${d.getDate()}. ${d.getMonth() + 1}.`;
const kat = u => (u.c === 'vlastne' ? VLASTNA : KATEGORIE[u.c]);

function tvar(text, pohlavie) {
  return text.replace(/\{([^|}]*)\|([^}]*)\}/g, (_, m, f) => {
    if (pohlavie === 'm') return m;
    if (pohlavie === 'f') return f;
    return f.startsWith(m) ? `${m}(${f.slice(m.length)})` : `${m}/${f}`;
  });
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
  return `<div class="dieta" data-k="${k}">
    <input type="text" id="meno-${k}" data-p="meno" placeholder="Meno, napr. Emka" value="${esc(d.meno || '')}" aria-label="Meno">
    <select id="vek-${k}" data-p="vek" aria-label="Vek">${opt(VEKY, d.vek || 's')}</select>
    <select id="pohlavie-${k}" data-p="pohlavie" aria-label="Oslovenie">${opt(OSLOVENIE, d.pohlavie || 'n')}</select>
    ${k > 0 ? `<button type="button" class="x" data-odober="${k}" aria-label="Odstrániť dieťa">×</button>` : ''}
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
    podpis: d.podpis === '*' ? (d.podpisVlastny || '').trim() : d.podpis,
    podpisVlastny: d.podpis === '*',
    tlac: d.tlac, farby: d.farby, tema: d.tema,
    naStranu: +d.naStranu, strihanie: d.strihanie,
    cas: d.cas, zadne: d.zadne, prehlad: d.prehlad, stitky: d.stitky,
    pocitanie: d.pocitanie, tlacene: d.tlacene, hadanky: d.hadanky, vyzvy: d.vyzvy, splnene: d.splnene,
    pismo: d.pismo || 'zaoblene',
  };
}

/* „6.12. Nadpis | text“ → úloha */
function vlastneUlohy(text) {
  return text.split('\n').map(s => s.trim()).filter(Boolean).map((riadok, j) => {
    const u = { c: 'vlastne', a: 'msv', i: 'srdce', id: 'v' + j, t: 'Moja úloha' };
    const m = riadok.match(/^(\d{1,2})\.\s*(\d{1,2})\.?\s+(.*)$/);
    if (m) { u.d = `${pad(m[2])}-${pad(m[1])}`; riadok = m[3]; }
    const [a, b] = riadok.split('|').map(s => s.trim());
    if (b) { u.t = a; u.x = b; } else u.x = a;
    return u;
  });
}

/* ---------- priradenie úloh ku dňom ---------- */
function vhodneUlohy(n, veky) {
  return ULOHY.map((u, id) => ({ ...u, id }))
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
      if (den.uloha) den.navyse = `Večer zapáľte ${advent}. sviečku na adventnom venci.`;
      else den.uloha = { ...SPECIALNE.nedela, id: 'nedela', t: SPECIALNE.nedela.t.replace('{n}', advent), x: SPECIALNE.nedela.x.replace('{n}', advent) };
    }
    if (!den.uloha && i === n.pocet - 1 && n.poklad) den.uloha = { ...SPECIALNE.posledna, id: 'posledna' };
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
  const hadanky = zamiesaj(HADANKY.filter(h => veky.every(v => h.a.includes(v))), r);
  const vyzvy = zamiesaj(VYZVY, r);
  let h = 0, v = 0;
  for (const den of dni) {
    if (n.hadanky && !veky0.includes('m') && den.cislo % 3 === 0 && hadanky.length) den.hadanka = hadanky[h++ % hadanky.length];
    else if (n.vyzvy && veky.every(x => x === 'v') && jeVikend(den.datum)) den.vyzva = vyzvy[v++ % vyzvy.length];
  }

  for (const den of dni) {
    const id = stav.vymeny[`${klucSady}:${den.i}`];
    if (id == null) continue;
    const u = vhodne.find(v => v.id === id);
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
  const povNadpis = u ? tvar(u.t, dieta.pohlavie) : 'Vyber aspoň jeden druh úloh';
  const povText = u ? tvar(textUlohy(u, dieta.vek), dieta.pohlavie) : '';
  const nadpis = uprava.t ?? povNadpis;
  const text = uprava.x ?? povText;
  const cb = n.tlac === 'cb';
  const znacky = [];
  if (n.cas && u && u.n) znacky.push(`<span class="badge time">${HODINY}${u.n >= 60 ? (u.n / 60).toString().replace('.', ',') + ' h' : u.n + ' min'}</span>`);
  if (u && u.e && dieta.vek !== 'm') znacky.push('<span class="badge">s dospelým</span>');
  const pata = [dieta.meno && `<span class="for">${esc(dieta.meno)}</span>`, n.podpis && `<span class="sign">${esc(n.podpis)}</span>`].filter(Boolean);
  let hviezdy = '';
  if (n.pocitanie && dieta.vek === 'm') {
    const skupiny = [];
    for (let j = 0; j < den.cislo; j += 5) skupiny.push(`<span class="grp">${HVIEZDICKA.repeat(Math.min(5, den.cislo - j))}</span>`);
    hviezdy = `<div class="stars" title="Spočítaj hviezdičky">${skupiny.join('')}</div>`;
  }
  const navyse = [
    den.navyse && `<div class="extra">${esc(den.navyse)}</div>`,
    den.hadanka && `<div class="riddle"><b>Hádanka:</b> ${esc(den.hadanka.q)}<span class="answer">${esc(den.hadanka.o)}</span></div>`,
    den.vyzva && `<div class="extra challenge"><b>Výzva navyše:</b> ${esc(den.vyzva)}</div>`,
  ].filter(Boolean).join('');
  const triedy = ['card', `vek-${dieta.vek}`, n.tlacene && dieta.vek !== 'v' ? 'tlacene' : ''].filter(Boolean).join(' ');
  return `<article class="${triedy}" style="--c:${farbaKarty(u, den, n)}" data-k="${k}" data-i="${den.i}">
    <div class="frame"></div>
    <div class="card-top"><span class="num">${den.cislo}</span>
      <span class="date">${kratkyDatum(d)}<small>${DNI[d.getDay()]}</small></span>
      ${znacky.length ? `<span class="badges">${znacky.join('')}</span>` : ''}</div>
    <div class="art">${u ? kresba(u.i || kat(u).ikona, n.tlac) : ''}${cb && u ? '<span class="color-me">vymaľuj ma</span>' : ''}${n.splnene ? '<span class="done">splnené</span>' : ''}</div>
    <div class="title" contenteditable="true" spellcheck="false" data-f="t" data-o="${esc(povNadpis)}">${esc(nadpis)}</div>
    <div class="text" contenteditable="true" spellcheck="false" data-f="x" data-o="${esc(povText)}">${esc(text)}</div>
    ${hviezdy}${navyse}
    ${pata.length ? `<div class="foot${pata.length === 1 ? ' one' : ''}">${pata.join('')}</div>` : ''}
    <div class="tools"><button type="button" data-lupa title="Zobraziť kartičku vo veľkom">Lupa</button><button type="button" data-vymen="${k}:${den.i}" title="Vybrať inú úlohu na tento deň">Iná úloha</button></div>
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
  const material = new Map();
  for (const d of dni) {
    const p = d.uloha && d.uloha.p;
    if (!p) continue;
    p.split(',').map(s => s.trim()).filter(Boolean).forEach(vec => { if (!material.has(vec)) material.set(vec, d.datum); });
  }
  const riadky = dni.map(d => {
    const u = d.uloha;
    const upr = stav.upravy[`${sada.k}:${d.i}`] || {};
    const nadpis = upr.t ?? (u ? tvar(u.c === 'vlastne' && u.t === 'Moja úloha' ? u.x : u.t, dieta.pohlavie) : '');
    const pozn = [u && u.e ? 's dospelým' : '', u && u.p ? 'pripraviť: ' + u.p : '', d.navyse].filter(Boolean).join(' · ');
    return `<tr class="${jeVikend(d.datum) ? 'we' : ''}"><td class="c">${d.cislo}</td><td>${kratkyDatum(d.datum)} ${DNI[d.datum.getDay()].slice(0, 2)}</td>
      <td><b>${esc(nadpis)}</b>${pozn ? `<small>${esc(pozn)}</small>` : ''}</td><td class="c">${u && u.n ? u.n + '′' : ''}</td></tr>`;
  }).join('');
  const zoznam = [...material.entries()].sort((a, b) => a[1] - b[1])
    .map(([vec, d]) => `<li><span class="box"></span>${esc(vec)} <em>do ${kratkyDatum(d)}</em></li>`).join('');
  return `<section class="sheet parent${dni.length > 20 ? ' dense' : ''}">
    <h2>Adventný plán${dieta.meno ? ' – ' + esc(dieta.meno) : ''}</h2>
    <p class="sub">Prehľad pre rodiča · víkendy sú podfarbené · ′ = minúty</p>
    <table><thead><tr><th>č.</th><th>dátum</th><th>úloha</th><th>čas</th></tr></thead><tbody>${riadky}</tbody></table>
    ${zoznam ? `<h3>Čo treba pripraviť</h3><ul class="shop">${zoznam}</ul>` : ''}
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
      const kk = c === 'vlastne' ? VLASTNA : KATEGORIE[c] || { nazov: c, farba: '#999' };
      return `<span style="flex:${p};background:${kk.farba}" title="${esc(kk.nazov)}: ${p}"></span>`;
    }).join('');
    const legenda = Object.entries(pocty).sort((a, b) => b[1] - a[1]).map(([c, p]) => {
      const kk = c === 'vlastne' ? VLASTNA : KATEGORIE[c] || { nazov: c, farba: '#999' };
      return `<span class="lg"><i style="background:${kk.farba}"></i>${esc(kk.nazov)} ${p}</span>`;
    }).join('');
    const meno = n.spolocne ? 'Spoločná sada' : (sada.dieta.meno || 'Sada');
    return `<div class="stat-row"><div class="stat-head"><b>${esc(meno)}</b>
      <span>spolu asi ${Math.round(minuty / 60)} h · vonku ${vonku}× · s dospelým ${dospely}× · ${Math.round(minuty / spolu)} min denne</span></div>
      <div class="bar">${pruh}</div><div class="legend">${legenda}</div></div>`;
  });
  $('#stats').innerHTML = riadky.join('');
}

function generuj() {
  const n = nastavenia();
  document.body.classList.toggle('tlac-cb', n.tlac === 'cb');
  document.body.classList.toggle('podpis-vlastny', n.podpisVlastny);
  document.body.classList.toggle('viac-deti', n.deti.length > 1);
  sady = vytvorSady(n);
  const [cols, rows] = ROZLOZENIE[n.naStranu];
  const per = cols * rows;
  let html = '', strany = 0;
  for (const sada of sady) {
    for (let i = 0; i < sada.dni.length; i += per) {
      const kus = sada.dni.slice(i, i + per);
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
    if (n.prehlad) { html += stranaPreRodica(sada, n); strany++; }
    if (n.stitky && (!n.spolocne || sada.k === 0)) { const s = harokStitkov(sada, n); html += s.html; strany += s.strany; }
  }
  const sheets = $('#sheets');
  sheets.innerHTML = html;
  sheets.className = `sheets ${n.tlac === 'cb' ? 'bw' : ''} ${n.tlac === 'farba' && n.farby === 'setrne' ? 'setrne' : ''} cut-${n.strihanie} pismo-${n.pismo}`;
  vykresliStatistiku(n);

  const upravene = Object.keys(stav.upravy).length + Object.keys(stav.vymeny).length;
  const kod = stav.seed.toString(36).toUpperCase();
  $('#info').innerHTML = `${sady.reduce((s, x) => s + x.dni.length, 0)} kartičiek · ${strany} ${strany === 1 ? 'strana' : strany < 5 ? 'strany' : 'strán'} A4`
    + ` · kód sady <b class="code">${kod}</b>`
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
  vykresliDeti([{ meno: '', vek: 's', pohlavie: 'n' }]);

  const ulozene = nacitaj();
  if (ulozene) {
    vyplnFormular(ulozene.form || {});
    stav = { ...stav, ...(ulozene.stav || {}) };
    for (const m of ['vymeny', 'upravy']) for (const key of Object.keys(stav[m])) if (!key.includes(':')) delete stav[m][key];
  }

  f.addEventListener('change', generuj);
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
    stav.vymeny = {}; stav.upravy = {};
    vykresliDeti(deti); generuj();
  });
  $('#zamiesat').addEventListener('click', () => { stav = { seed: novySeed(), vymeny: {}, upravy: {} }; generuj(); });
  $('#nacitajKod').addEventListener('click', () => {
    const s = parseInt($('#kodVstup').value.trim(), 36);
    if (!Number.isFinite(s)) { $('#kodVstup').setCustomValidity('Kód obsahuje len písmená a číslice.'); $('#kodVstup').reportValidity(); return; }
    $('#kodVstup').setCustomValidity('');
    stav = { seed: s, vymeny: {}, upravy: {} }; generuj();
  });
  $('#tlacit').addEventListener('click', () => window.print());

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
  $('#info').addEventListener('click', e => { if (e.target.id === 'zrusUpravy') { stav.vymeny = {}; stav.upravy = {}; generuj(); } });
  window.addEventListener('resize', prisposobZoom);
  generuj();
}
init();

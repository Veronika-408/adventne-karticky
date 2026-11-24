/* Ilustrácie ako SVG. Každá kresba sa vie vykresliť farebne
   alebo ako omaľovánka (čiernobiela tlač: biele plochy, čierne obrysy). */

const PALETA = {
  r:'#d2463a', rd:'#9e2f27', g:'#3f8a4b', gd:'#2b6436', y:'#f2b93b', cr:'#f8e7bd',
  br:'#a8693c', bl:'#b9dcf2', b:'#4f8fc9', w:'#ffffff', o:'#f08a2c', p:'#f4b3c2',
  s:'#f8dcbf', pu:'#8a62b2', k:'#3a2418'
};

const KRESBY = {
  snehuliak: (F, L) => `
    <path d="M31 64 L15 54 M19 57 L15 50" fill="none" stroke="${L('br')}" stroke-width="3"/>
    <path d="M69 64 L85 54 M81 57 L85 50" fill="none" stroke="${L('br')}" stroke-width="3"/>
    <circle cx="50" cy="72" r="22" fill="${F('w')}"/>
    <circle cx="50" cy="40" r="15" fill="${F('w')}"/>
    <path d="M37 31 Q50 10 63 31 Z" fill="${F('r')}"/>
    <rect x="34" y="28" width="32" height="7" rx="3.5" fill="${F('w')}"/>
    <circle cx="50" cy="14" r="5" fill="${F('w')}"/>
    <path d="M37 51 Q50 58 63 51 L63 57 Q50 64 37 57 Z" fill="${F('r')}"/>
    <path d="M55 57 L58 72 L65 70 L61 56 Z" fill="${F('r')}"/>
    <circle cx="44.5" cy="38" r="1.9" fill="${PALETA.k}" stroke="none"/>
    <circle cx="55.5" cy="38" r="1.9" fill="${PALETA.k}" stroke="none"/>
    <path d="M50 42 L62 45 L50 47 Z" fill="${F('o')}"/>
    <circle cx="50" cy="68" r="2.2" fill="${PALETA.k}" stroke="none"/>
    <circle cx="50" cy="78" r="2.2" fill="${PALETA.k}" stroke="none"/>`,

  svieca: (F, L) => `
    <path d="M50 12 Q63 28 50 38 Q37 28 50 12 Z" fill="${F('o')}"/>
    <path d="M50 22 Q56 30 50 35 Q44 30 50 22 Z" fill="${F('y')}"/>
    <path d="M50 38 L50 44" fill="none"/>
    <path d="M37 44 L63 44 L63 86 L37 86 Z" fill="${F('cr')}"/>
    <path d="M37 44 L63 44 L63 52 Q60 58 57 52 Q53 47 49 54 Q46 58 43 51 Q40 47 37 52 Z" fill="${F('w')}"/>
    <path d="M37 66 Q50 72 63 66 L63 72 Q50 78 37 72 Z" fill="${F('r')}"/>
    <path d="M37 84 Q22 72 14 82 Q22 92 37 88 Z" fill="${F('g')}"/>
    <path d="M63 84 Q78 72 86 82 Q78 92 63 88 Z" fill="${F('g')}"/>
    <circle cx="64" cy="88" r="4" fill="${F('r')}"/><circle cx="71" cy="86" r="4" fill="${F('r')}"/>`,

  hviezda: (F, L) => `
    <polygon points="50,12 59.4,38 87,39.5 65.2,56.5 73,84 50,68 27,84 34.8,56.5 13,39.5 40.6,38" fill="${F('y')}"/>
    <path d="M50 30 L50 44 M43 37 L57 37" fill="none" stroke="${L('w')}" stroke-width="2.5"/>
    <path d="M84 14 L84 24 M79 19 L89 19 M16 70 L16 78 M12 74 L20 74" fill="none"/>`,

  stromcek: (F, L) => `
    <rect x="44" y="80" width="12" height="12" fill="${F('br')}"/>
    <polygon points="50,44 82,82 18,82" fill="${F('g')}"/>
    <polygon points="50,28 74,62 26,62" fill="${F('g')}"/>
    <polygon points="50,14 66,42 34,42" fill="${F('g')}"/>
    <path d="M36 52 Q50 58 64 50 M30 72 Q50 80 72 70" fill="none" stroke="${L('y')}" stroke-width="2.5"/>
    <circle cx="44" cy="36" r="3.5" fill="${F('r')}"/><circle cx="58" cy="57" r="3.5" fill="${F('b')}"/>
    <circle cx="40" cy="64" r="3.5" fill="${F('y')}"/><circle cx="62" cy="76" r="3.5" fill="${F('r')}"/>
    <circle cx="36" cy="78" r="3.5" fill="${F('b')}"/>
    <polygon transform="translate(50 12) scale(0.26) translate(-50 -50)" points="50,12 59.4,38 87,39.5 65.2,56.5 73,84 50,68 27,84 34.8,56.5 13,39.5 40.6,38" fill="${F('y')}"/>`,

  darcek: (F, L) => `
    <rect x="22" y="46" width="56" height="40" fill="${F('r')}"/>
    <rect x="18" y="35" width="64" height="13" rx="2" fill="${F('r')}"/>
    <rect x="45" y="35" width="10" height="51" fill="${F('y')}"/>
    <path d="M50 35 C40 16 24 22 36 35 Z" fill="${F('y')}"/>
    <path d="M50 35 C60 16 76 22 64 35 Z" fill="${F('y')}"/>
    <circle cx="32" cy="64" r="3" fill="${F('w')}"/><circle cx="68" cy="72" r="3" fill="${F('w')}"/><circle cx="66" cy="56" r="2.5" fill="${F('w')}"/>`,

  zvoncek: (F, L) => `
    <circle cx="50" cy="80" r="6" fill="${F('y')}"/>
    <path d="M50 22 C34 22 31 40 31 56 C31 66 25 70 22 76 L78 76 C75 70 69 66 69 56 C69 40 66 22 50 22 Z" fill="${F('y')}"/>
    <path d="M40 34 Q37 46 38 58" fill="none" stroke="${L('w')}" stroke-width="3"/>
    <path d="M50 22 C40 8 28 14 40 22 Z" fill="${F('r')}"/>
    <path d="M50 22 C60 8 72 14 60 22 Z" fill="${F('r')}"/>
    <path d="M24 70 L76 70" fill="none"/>`,

  medovnik: (F, L) => `
    <circle cx="50" cy="26" r="13" fill="${F('br')}"/>
    <path d="M39 39 L25 45 Q17 50 22 57 L37 54 L33 78 Q31 87 39 87 L46 87 L50 73 L54 87 L61 87 Q69 87 67 78 L63 54 L78 57 Q83 50 75 45 L61 39 Z" fill="${F('br')}"/>
    <path d="M24 50 l3 3 l3 -3 l3 3 M67 50 l3 3 l3 -3 l3 3 M37 80 l3 -3 l3 3 M57 80 l3 -3 l3 3" fill="none" stroke="${L('w')}" stroke-width="2"/>
    <circle cx="45" cy="24" r="2" fill="${PALETA.k}" stroke="none"/><circle cx="55" cy="24" r="2" fill="${PALETA.k}" stroke="none"/>
    <path d="M44 30 Q50 35 56 30" fill="none" stroke="${L('w')}" stroke-width="2"/>
    <circle cx="50" cy="48" r="3.2" fill="${F('r')}"/><circle cx="50" cy="59" r="3.2" fill="${F('g')}"/>`,

  cizma: (F, L) => `
    <path d="M36 32 L36 64 Q36 70 30 72 L22 75 Q13 79 17 87 L66 87 Q73 87 73 80 L73 32 Z" fill="${F('r')}"/>
    <rect x="31" y="20" width="47" height="15" rx="7" fill="${F('w')}"/>
    <path d="M44 20 L48 6 M48 6 Q54 2 56 8" fill="none" stroke="${L('r')}" stroke-width="3.5"/>
    <circle cx="62" cy="14" r="7" fill="${F('o')}"/>
    <path d="M17 80 L73 80" fill="none"/>
    <circle cx="54" cy="56" r="3" fill="${F('y')}"/>`,

  vlocka: (F, L) => {
    let ramena = '';
    for (let k = 0; k < 6; k++) {
      ramena += `<g transform="rotate(${k * 60} 50 50)"><path d="M50 50 L50 13 M50 26 L42 18 M50 26 L58 18 M50 37 L43 31 M50 37 L57 31" fill="none" stroke="${L('b')}" stroke-width="3.4"/></g>`;
    }
    return ramena + `<circle cx="50" cy="50" r="7" fill="${F('bl')}"/>`;
  },

  ozdoba: (F, L) => `
    <path d="M50 24 Q50 12 58 12" fill="none"/>
    <circle cx="50" cy="58" r="28" fill="${F('r')}"/>
    <rect x="43" y="25" width="14" height="8" rx="2" fill="${F('y')}"/>
    <path d="M23 52 Q30 46 37 52 T50 52 T63 52 T77 52 L78 62 Q71 68 64 62 T50 62 T36 62 T22 62 Z" fill="${F('w')}"/>
    <circle cx="36" cy="74" r="2.6" fill="${F('y')}"/><circle cx="50" cy="78" r="2.6" fill="${F('y')}"/><circle cx="64" cy="74" r="2.6" fill="${F('y')}"/>
    <path d="M36 40 Q40 36 45 35" fill="none" stroke="${L('w')}" stroke-width="3"/>`,

  hrncek: (F, L) => `
    <path d="M42 30 Q36 22 42 14 M54 30 Q48 22 54 14" fill="none" stroke="${L('br')}" stroke-width="2.5"/>
    <path d="M69 48 C88 45 88 76 66 75 L66 67 C78 67 78 55 69 56 Z" fill="${F('r')}"/>
    <path d="M24 38 L72 38 L67 84 Q66 89 60 89 L36 89 Q30 89 29 84 Z" fill="${F('r')}"/>
    <ellipse cx="48" cy="38" rx="24" ry="5.5" fill="${F('br')}"/>
    <path d="M48 72 C38 64 38 56 44 55 C47 55 48 58 48 59 C48 58 49 55 52 55 C58 56 58 64 48 72 Z" fill="${F('w')}"/>`,

  srdce: (F, L) => `
    <path d="M50 84 C20 62 12 46 22 32 C30 22 44 24 50 36 C56 24 70 22 78 32 C88 46 80 62 50 84 Z" fill="${F('r')}"/>
    <path d="M28 40 Q30 32 38 31" fill="none" stroke="${L('w')}" stroke-width="3.5"/>
    <path d="M82 18 L82 26 M78 22 L86 22 M16 18 L16 24 M13 21 L19 21" fill="none"/>`,

  kniha: (F, L) => `
    <path d="M10 34 L10 84 C24 80 40 80 50 88 C60 80 76 80 90 84 L90 34 Z" fill="${F('pu')}"/>
    <path d="M50 36 C40 28 26 27 15 30 L15 78 C27 75 40 76 50 83 Z" fill="${F('w')}"/>
    <path d="M50 36 C60 28 74 27 85 30 L85 78 C73 75 60 76 50 83 Z" fill="${F('w')}"/>
    <path d="M22 42 L42 44 M22 52 L42 54 M22 62 L38 63 M58 44 L78 42 M58 54 L78 52 M58 63 L74 62" fill="none" stroke-width="1.6"/>
    <polygon transform="translate(50 16) scale(0.22) translate(-50 -50)" points="50,12 59.4,38 87,39.5 65.2,56.5 73,84 50,68 27,84 34.8,56.5 13,39.5 40.6,38" fill="${F('y')}"/>`,

  nota: (F, L) => `
    <polygon points="38,28 76,18 76,28 38,38" fill="${F('pu')}"/>
    <rect x="35" y="30" width="5" height="44" fill="${F('pu')}"/>
    <rect x="73" y="20" width="5" height="44" fill="${F('pu')}"/>
    <ellipse cx="30" cy="75" rx="10" ry="8" transform="rotate(-20 30 75)" fill="${F('pu')}"/>
    <ellipse cx="68" cy="65" rx="10" ry="8" transform="rotate(-20 68 65)" fill="${F('pu')}"/>
    <path d="M14 30 L14 40 M9 35 L19 35 M86 78 L86 86 M82 82 L90 82" fill="none"/>`,

  sane: (F, L) => `
    <rect x="36" y="22" width="24" height="22" fill="${F('g')}"/>
    <rect x="45" y="22" width="6" height="22" fill="${F('y')}"/>
    <rect x="22" y="44" width="56" height="15" rx="4" fill="${F('r')}"/>
    <rect x="30" y="59" width="6" height="13" fill="${F('br')}"/>
    <rect x="64" y="59" width="6" height="13" fill="${F('br')}"/>
    <path d="M12 72 L80 72 Q90 72 89 62" fill="none" stroke="${L('br')}" stroke-width="5"/>
    <path d="M10 84 Q30 80 50 84 T90 84" fill="none" stroke="${L('bl')}" stroke-width="3"/>`,

  veniec: (F, L) => `
    <ellipse cx="50" cy="70" rx="40" ry="16" fill="${F('g')}"/>
    <ellipse cx="50" cy="68" rx="24" ry="7" fill="${F('w')}"/>
    <rect x="18" y="46" width="9" height="24" fill="${F('pu')}"/>
    <rect x="36" y="38" width="9" height="26" fill="${F('pu')}"/>
    <rect x="55" y="38" width="9" height="26" fill="${F('p')}"/>
    <rect x="73" y="46" width="9" height="24" fill="${F('pu')}"/>
    <path d="M22.5 34 Q28 41 22.5 45 Q17 41 22.5 34 Z M40.5 26 Q46 33 40.5 37 Q35 33 40.5 26 Z M59.5 26 Q65 33 59.5 37 Q54 33 59.5 26 Z M77.5 34 Q83 41 77.5 45 Q72 41 77.5 34 Z" fill="${F('o')}"/>
    <circle cx="30" cy="80" r="3.2" fill="${F('r')}"/><circle cx="50" cy="84" r="3.2" fill="${F('r')}"/><circle cx="70" cy="80" r="3.2" fill="${F('r')}"/>`,

  vtacik: (F, L) => `
    <path d="M10 82 Q50 74 92 80" fill="none" stroke="${L('br')}" stroke-width="4"/>
    <path d="M30 62 L10 56 L16 70 Z" fill="${F('br')}"/>
    <ellipse cx="50" cy="60" rx="25" ry="19" fill="${F('br')}"/>
    <path d="M58 48 Q76 56 66 74 Q52 80 44 70 Q52 62 58 48 Z" fill="${F('r')}"/>
    <circle cx="66" cy="40" r="13" fill="${F('br')}"/>
    <polygon points="78,38 88,42 78,45" fill="${F('y')}"/>
    <circle cx="70" cy="37" r="2" fill="${PALETA.k}" stroke="none"/>
    <path d="M46 79 L44 86 M54 79 L56 86" fill="none"/>
    <path d="M36 56 Q44 50 50 58" fill="none"/>`,

  skriatok: (F, L) => `
    <path d="M30 56 L20 48 L32 64 Z M70 56 L80 48 L68 64 Z" fill="${F('s')}"/>
    <circle cx="50" cy="60" r="20" fill="${F('s')}"/>
    <path d="M30 50 Q38 10 80 16 Q60 26 70 50 Z" fill="${F('g')}"/>
    <rect x="28" y="45" width="44" height="9" rx="4.5" fill="${F('r')}"/>
    <circle cx="80" cy="16" r="6" fill="${F('w')}"/>
    <circle cx="43" cy="62" r="2" fill="${PALETA.k}" stroke="none"/><circle cx="57" cy="62" r="2" fill="${PALETA.k}" stroke="none"/>
    <circle cx="38" cy="69" r="3.5" fill="${F('p')}" stroke="none"/><circle cx="62" cy="69" r="3.5" fill="${F('p')}" stroke="none"/>
    <path d="M44 71 Q50 76 56 71" fill="none"/>`,

  domcek: (F, L) => `
    <rect x="62" y="20" width="9" height="18" fill="${F('rd')}"/>
    <rect x="24" y="46" width="52" height="40" fill="${F('cr')}"/>
    <polygon points="16,50 50,20 84,50" fill="${F('rd')}"/>
    <path d="M16 50 L50 20 L84 50 L80 54 Q74 48 68 52 Q60 46 52 52 Q44 46 36 52 Q28 46 20 54 Z" fill="${F('w')}"/>
    <rect x="44" y="62" width="13" height="24" fill="${F('br')}"/>
    <rect x="29" y="58" width="11" height="11" fill="${F('y')}"/><rect x="62" y="58" width="11" height="11" fill="${F('y')}"/>
    <path d="M34.5 58 L34.5 69 M29 63.5 L40 63.5 M67.5 58 L67.5 69 M62 63.5 L73 63.5" fill="none" stroke-width="1.5"/>`,

  anjel: (F, L) => `
    <path d="M44 48 Q16 30 14 58 Q26 62 44 58 Z" fill="${F('w')}"/>
    <path d="M56 48 Q84 30 86 58 Q74 62 56 58 Z" fill="${F('w')}"/>
    <path d="M50 42 L72 88 L28 88 Z" fill="${F('bl')}"/>
    <circle cx="50" cy="34" r="12" fill="${F('s')}"/>
    <path d="M38 32 Q40 18 50 20 Q60 18 62 32 Q56 26 50 27 Q44 26 38 32 Z" fill="${F('y')}"/>
    <ellipse cx="50" cy="14" rx="12" ry="4" fill="none" stroke="${L('y')}" stroke-width="3"/>
    <circle cx="45.5" cy="35" r="1.6" fill="${PALETA.k}" stroke="none"/><circle cx="54.5" cy="35" r="1.6" fill="${PALETA.k}" stroke="none"/>
    <path d="M46 40 Q50 43 54 40" fill="none" stroke-width="1.5"/>
    <polygon transform="translate(50 66) scale(0.2) translate(-50 -50)" points="50,12 59.4,38 87,39.5 65.2,56.5 73,84 50,68 27,84 34.8,56.5 13,39.5 40.6,38" fill="${F('y')}"/>`,

  vetvicka: (F, L) => {
    const kvet = (x, y) => [0, 72, 144, 216, 288].map(u => {
      const a = u * Math.PI / 180;
      return `<circle cx="${(x + Math.cos(a) * 5).toFixed(1)}" cy="${(y + Math.sin(a) * 5).toFixed(1)}" r="4.2" fill="${F('p')}"/>`;
    }).join('') + `<circle cx="${x}" cy="${y}" r="2.6" fill="${F('y')}"/>`;
    return `
    <path d="M50 66 L48 40 L34 20 M48 46 L64 26 M56 36 L70 32 M41 30 L30 32" fill="none" stroke="${L('br')}" stroke-width="3.2"/>
    ${kvet(34, 20)}${kvet(64, 26)}${kvet(71, 33)}${kvet(28, 32)}
    <path d="M36 62 L64 62 L60 88 L40 88 Z" fill="${F('b')}"/>
    <path d="M38 70 L62 70" fill="none" stroke="${L('bl')}" stroke-width="2"/>`;
  },

  mapa: (F, L) => `
    <path d="M12 22 L36 16 L64 24 L88 18 L88 80 L64 86 L36 78 L12 84 Z" fill="${F('cr')}"/>
    <path d="M36 16 L36 78 M64 24 L64 86" fill="none" stroke-width="1.5"/>
    <path d="M20 72 Q30 60 42 62 T58 48 T74 36" fill="none" stroke="${L('br')}" stroke-width="2.5" stroke-dasharray="4 4"/>
    <path d="M70 30 L80 40 M80 30 L70 40" fill="none" stroke="${L('r')}" stroke-width="4"/>
    <polygon points="22,36 30,50 14,50" fill="${F('g')}"/>
    <rect x="20.5" y="50" width="3" height="5" fill="${F('br')}"/>`,
};

/* Vykreslí ilustráciu. rezim: 'farba' alebo 'cb' (čiernobiela omaľovánka) */
function kresba(meno, rezim) {
  const fn = KRESBY[meno] || KRESBY.hviezda;
  const cb = rezim === 'cb';
  const F = c => cb ? '#ffffff' : PALETA[c];
  const L = c => cb ? '#1a1a1a' : PALETA[c];
  const obrys = cb ? '#1a1a1a' : '#5a3a28';
  const hrubka = cb ? 2.4 : 1.8;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="${obrys}" stroke-width="${hrubka}" stroke-linejoin="round" stroke-linecap="round">${fn(F, L)}</g></svg>`;
}

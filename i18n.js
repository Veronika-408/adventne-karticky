/* Jazyky: slovenčina (sk) a angličtina (en).
   UI_EN = statické texty stránky (slovenské sú priamo v index.html, kľúč v data-i18n).
   STR = texty, ktoré skladá app.js. */

const UI_EN = {
  title: 'Advent cards',
  sub: 'Choose who they are for, then print them.',
  deti: 'Children',
  pridaj: '+ Add a sibling',
  spolocne: 'Same tasks for all children',
  kalendar: 'Calendar',
  zaciatok: 'Start',
  okienok: 'Windows',
  maxMin: 'Weekday tasks take at most',
  min15: '15 minutes', min30: '30 minutes', min45: '45 minutes',
  poklad: 'Last window: treasure hunt',
  odpocet: 'countdown “12 days until Christmas Eve”',
  noteKal: 'Holidays (St Nicholas, St Lucy…) and Advent Sundays land on the right day automatically. Trips and long activities fall on weekends.',
  obsah: 'Content',
  druhy: 'Task types',
  doma: 'In our family',
  bezNab: 'no religious traditions',
  bezVon: 'no outdoor tasks',
  bezPenazi: 'no tasks that cost money',
  vlastne: 'Your own tasks <span class="muted">(one per line, date as day.month.)</span>',
  podpis: 'Signature on the cards',
  podpis0: 'no signature', podpisJ: 'Love, Santa', podpisA: 'Love, your angel', podpisS: 'Love, your elf', podpisR: 'Love, Mum and Dad', podpisV: 'custom…',
  vek: 'By age',
  pocitanie: '3–5: stars to count',
  tlacene: '6–8: CAPITAL LETTERS',
  hadanky: '6–12: a riddle on every 3rd card',
  vyzvy: '9–12: bonus challenge at weekends',
  splnene: '“done” circle for a sticker',
  pismo: 'Font on the cards',
  pismoZ: 'rounded', pismoR: 'handwritten', pismoS: 'school style, easy to read',
  tlac: 'Printing',
  tlaciaren: 'Printer',
  farebna: 'Colour',
  cb: 'Black & white',
  plne: 'Full colour',
  setrne: 'Save ink',
  tema: 'Colour scheme',
  temaP: 'mixed (by task type)', temaK: 'red and green', temaZ: 'wintry blue', temaG: 'gold and brown',
  noteCb: 'Pictures will be colouring pages – children colour them in themselves.',
  naStranu: 'Cards per A4',
  ns4: '4 (large)', ns6: '6 (like the sample)', ns8: '8 (smaller)', ns12: '12 (mini)',
  strihanie: 'Cut marks',
  cutC: 'lines', cutR: 'corners', cutN: 'none',
  cas: 'show how long each task takes',
  zadne: 'numbered backs (double-sided printing)',
  prehlad: 'parent page: overview and shopping list',
  stitky: 'number labels for gift bags',
  titulka: 'cover page with name',
  vyber: 'Reprint only cards no. <span class="muted">(empty = all)</span>',
  tlacTest: 'Print a test page',
  tipyH: 'How to print',
  zaloha: 'Backup and set code',
  zalohaNote: 'A backup saves everything, including your edits, to a file. Load it on any other computer.',
  export: 'Save backup',
  import: 'Load backup',
  kodNote: 'Same code and same settings = same cards (without manual edits).',
  pouzit: 'Use',
  zamiesat: 'Shuffle tasks',
  tlacit: 'Print',
  zavriet: 'Close',
  // placeholders and labels
  'ph.vlastne': '6.12. Visit Grandma\nCinema | Going to see a film together',
  'ph.podpis': 'e.g. Granny Ann',
  'ph.vyber': 'e.g. 3, 7-9',
  'ph.kod': 'e.g. 1A2B3C',
  'aria.kod': 'Set code',
  'aria.lupa': 'Enlarged card',
  'aria.jazyk': 'Language',
};

const STR = {
  sk: {
    dni: ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'],
    datum: d => `${d.getDate()}. ${d.getMonth() + 1}.`,
    veky: { m: '3 – 5 rokov', s: '6 – 8 rokov', v: '9 – 12 rokov' },
    oslovenie: { f: 'dievča', m: 'chlapec', n: 'neuvádzať' },
    menoPh: 'Meno, napr. Emka', menoAria: 'Meno', vekAria: 'Vek', oslAria: 'Oslovenie', odober: 'Odstrániť dieťa',
    mojaUloha: 'Moja úloha',
    doVianoc: n => n === 0 ? 'dnes je Štedrý deň!' : n === 1 ? 'zajtra sú Vianoce!' : `do Vianoc ešte ${n} ${n < 5 ? 'dni' : 'dní'}`,
    adventNavyse: k => `Večer zapáľte ${k}. sviečku na adventnom venci.`,
    poradie: k => `${k}.`,
    ziadnaUloha: 'Vyber aspoň jeden druh úloh',
    sDospelym: 's dospelým',
    cas: m => m >= 60 ? `${String(m / 60).replace('.', ',')} h` : `${m} min`,
    spocitaj: 'Spočítaj hviezdičky',
    hadanka: 'Hádanka:', vyzva: 'Výzva navyše:',
    vymalujMa: 'vymaľuj ma', splnene: 'splnené',
    presunTitle: 'Potiahni na inú kartičku a vymenia si dni', presun: 'Presunúť',
    zamknut: 'Zamknúť', zamknuta: 'Zamknutá', zamokTitle: 'Zamknutá kartička sa pri zamiešaní nezmení',
    lupa: 'Lupa', lupaTitle: 'Zobraziť kartičku vo veľkom',
    ina: 'Iná úloha', inaTitle: 'Vybrať inú úlohu na tento deň',
    plan: 'Adventný plán', planSub: 'Prehľad pre rodiča · víkendy sú podfarbené · ′ = minúty',
    thead: ['č.', 'dátum', 'úloha', 'čas'], pripravit: 'pripraviť: ', do: 'do', coPripravit: 'Čo treba pripraviť',
    spolocnaSada: 'Spoločná sada', sada: 'Sada',
    statRiadok: (h, von, dosp, den) => `spolu asi ${h} h · vonku ${von}× · s dospelým ${dosp}× · ${den} min denne`,
    kalendarTitul: 'Adventný kalendár',
    titulText: (n, poklad) => `Každý deň otvor jedno okienko a splň úlohu, ktorá sa v ňom skrýva. Spolu ich je ${n}${poklad ? ' a na konci ťa čaká poklad' : ''}.`,
    tipy: n => [
      'V okne tlače zvoľ papier <b>A4</b> a mierku <b>100 %</b> (nie „prispôsobiť“).',
      'Vypni <b>hlavičky a päty</b>, aby sa na hárku neobjavila adresa stránky.',
      n.tlac === 'cb'
        ? 'Pri čiernobielej tlačiarni nastav <b>odtiene sivej</b> – obrázky sú obrysy na vyfarbenie.'
        : 'Zapni <b>grafiku pozadia</b> (Chrome: Ďalšie nastavenia → Grafika na pozadí), inak zmiznú farebné plochy.',
      n.tlac === 'farba' && n.farby !== 'setrne' ? 'Ak dochádza atrament, prepni na <b>Šetriť atrament</b>.' : '',
      n.zadne ? 'Zadné strany: obojstranná tlač s <b>otáčaním cez dlhú hranu</b>. Najprv vyskúšaj jeden hárok.' : '',
      n.naStranu >= 8 ? 'Pri malých kartičkách použi hrubší papier (160 g), lepšie sa strihajú.' : 'Na kartičky stačí bežný papier, hrubší (120–160 g) vydrží viac.',
      'Ak nevieš, aké okraje tlačiareň zvládne, vytlač najprv <b>skúšobnú stranu</b>.',
    ],
    test: {
      ramik: 'Ak vidíš celý tento rámik (5 mm od okraja), kartičky sa vytlačia celé.',
      nadpis: 'Skúšobná strana',
      pravitko: 'Pravítko musí mať presne 10 cm. Ak je kratšie, v okne tlače nastav mierku 100 %.',
      farby: 'Farby', sive: 'Odtiene sivej',
      pozn: 'Ak sú farebné políčka vyblednuté alebo pruhované, vyčisti trysky alebo zvoľ čiernobielu tlač – kartičky sa vytlačia ako omaľovánky.',
    },
    zalohaOk: 'Záloha je načítaná.',
    zalohaChyba: 'Tento súbor sa nedá načítať – vyber súbor .json uložený z tejto stránky.',
    sviatokPresun: 'Na tento deň patrí sviatok, ten sa presunúť nedá.',
    kodChyba: 'Kód obsahuje len písmená a číslice.',
    lenVybrane: 'Len vybrané kartičky',
    info: (karty, strany) => `${karty} kartičiek · ${strany} ${strany === 1 ? 'strana' : strany < 5 ? 'strany' : 'strán'} A4`,
    kodSady: 'kód sady', hint: 'Kliknutím na text ho upravíš.', zrus: n => `Zrušiť moje úpravy (${n})`,
    podpisy: { jezisko: 'Tvoj Ježiško', anjel: 'Tvoj anjelik', skriatok: 'Tvoj škriatok', rodicia: 'Mama a ocko' },
    nazovStranky: 'Adventné kartičky',
  },
  en: {
    dni: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datum: d => `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`,
    veky: { m: '3 – 5 years', s: '6 – 8 years', v: '9 – 12 years' },
    oslovenie: { f: 'girl', m: 'boy', n: 'not specified' },
    menoPh: 'Name, e.g. Emma', menoAria: 'Name', vekAria: 'Age', oslAria: 'Girl or boy', odober: 'Remove child',
    mojaUloha: 'My task',
    doVianoc: n => n === 0 ? 'it’s Christmas Eve!' : n === 1 ? 'Christmas Eve is tomorrow!' : `${n} days until Christmas Eve`,
    adventNavyse: k => `In the evening, light the ${PORADIE_EN[k]} candle on the Advent wreath.`,
    poradie: k => PORADIE_EN[k].replace(/^./, c => c.toUpperCase()),
    ziadnaUloha: 'Choose at least one task type',
    sDospelym: 'with an adult',
    cas: m => m >= 60 ? `${m / 60} h` : `${m} min`,
    spocitaj: 'Count the stars',
    hadanka: 'Riddle:', vyzva: 'Bonus challenge:',
    vymalujMa: 'colour me', splnene: 'done',
    presunTitle: 'Drag onto another card to swap their days', presun: 'Move',
    zamknut: 'Lock', zamknuta: 'Locked', zamokTitle: 'A locked card stays the same when you shuffle',
    lupa: 'Zoom', lupaTitle: 'Show the card enlarged',
    ina: 'Another task', inaTitle: 'Choose a different task for this day',
    plan: 'Advent plan', planSub: 'Overview for parents · weekends are shaded · ′ = minutes',
    thead: ['no.', 'date', 'task', 'time'], pripravit: 'prepare: ', do: 'by', coPripravit: 'What to get ready',
    spolocnaSada: 'Shared set', sada: 'Set',
    statRiadok: (h, von, dosp, den) => `about ${h} h in total · outdoors ${von}× · with an adult ${dosp}× · ${den} min a day`,
    kalendarTitul: 'Advent calendar',
    titulText: (n, poklad) => `Open one window every day and do the task hidden inside. There are ${n} of them${poklad ? ', and a treasure is waiting for you at the end' : ''}.`,
    tipy: n => [
      'In the print dialog choose <b>A4</b> paper and <b>100 %</b> scale (not “fit to page”).',
      'Turn off <b>headers and footers</b> so the page address isn’t printed.',
      n.tlac === 'cb'
        ? 'On a black & white printer choose <b>greyscale</b> – the pictures are outlines to colour in.'
        : 'Turn on <b>background graphics</b> (Chrome: More settings → Background graphics), otherwise coloured areas disappear.',
      n.tlac === 'farba' && n.farby !== 'setrne' ? 'If you are running low on ink, switch to <b>Save ink</b>.' : '',
      n.zadne ? 'Backs: print double-sided and <b>flip on the long edge</b>. Try one sheet first.' : '',
      n.naStranu >= 8 ? 'For small cards use thicker paper (160 gsm), it is easier to cut.' : 'Ordinary paper is fine; thicker paper (120–160 gsm) lasts longer.',
      'If you’re not sure what margins your printer can handle, print a <b>test page</b> first.',
    ],
    test: {
      ramik: 'If you can see this whole frame (5 mm from the edge), the cards will print in full.',
      nadpis: 'Test page',
      pravitko: 'The ruler must be exactly 10 cm long. If it is shorter, set the scale to 100 % in the print dialog.',
      farby: 'Colours', sive: 'Shades of grey',
      pozn: 'If the colour patches are faded or streaky, clean the print heads or choose black & white printing – the cards will print as colouring pages.',
    },
    zalohaOk: 'Backup loaded.',
    zalohaChyba: 'This file can’t be loaded – choose a .json file saved from this page.',
    sviatokPresun: 'This day belongs to a holiday, so it can’t be moved.',
    kodChyba: 'The code contains only letters and digits.',
    lenVybrane: 'Selected cards only',
    info: (karty, strany) => `${karty} cards · ${strany} A4 ${strany === 1 ? 'page' : 'pages'}`,
    kodSady: 'set code', hint: 'Click any text to edit it.', zrus: n => `Undo my edits (${n})`,
    podpisy: { jezisko: 'Love, Santa', anjel: 'Love, your angel', skriatok: 'Love, your elf', rodicia: 'Love, Mum and Dad' },
    nazovStranky: 'Advent cards',
  },
};

/* staré uložené podpisy boli priamo text */
const STARE_PODPISY = { 'Tvoj Ježiško': 'jezisko', 'Tvoj anjelik': 'anjel', 'Tvoj škriatok': 'skriatok', 'Mama a ocko': 'rodicia' };

let JAZYK = 'sk';
const T = () => STR[JAZYK];

/* Preloží statické texty stránky */
function prelozStranku() {
  const en = JAZYK === 'en';
  document.documentElement.lang = JAZYK;
  document.title = T().nazovStranky;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.sk == null) el.dataset.sk = el.innerHTML;
    el.innerHTML = en ? (UI_EN[el.dataset.i18n] ?? el.dataset.sk) : el.dataset.sk;
  });
  for (const [attr, pref] of [['placeholder', 'ph'], ['aria-label', 'aria']]) {
    document.querySelectorAll(`[data-i18n-${pref}]`).forEach(el => {
      const key = `data-sk-${pref}`;
      if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(attr) || '');
      el.setAttribute(attr, en ? (UI_EN[`${pref}.${el.getAttribute(`data-i18n-${pref}`)}`] ?? el.getAttribute(key)) : el.getAttribute(key));
    });
  }
}

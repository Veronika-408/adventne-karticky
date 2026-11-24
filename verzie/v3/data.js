/* Databáza úloh pre adventné kartičky.
   c = kategória, a = vekové skupiny (m = 3–5, s = 6–8, v = 9–12)
   t = nadpis, x = text (reťazec alebo {m:…, s:…, v:…} podľa veku)
   {tvar pre chlapca|tvar pre dievča}
   i = ilustrácia, d = pevný dátum MM-DD, w = hodí sa na víkend, o = vonku,
   r = náboženská tradícia, k = stojí peniaze, n = minúty, p = materiál, e = s dospelým */

const KATEGORIE = {
  skutok:    { nazov: 'Dobrý skutok',            ikona: 'srdce',    farba: '#c8372d' },
  tvorenie:  { nazov: 'Tvoríme',                 ikona: 'hviezda',  farba: '#d98a1c' },
  kuchyna:   { nazov: 'Pečieme a varíme',        ikona: 'medovnik', farba: '#9a5b2e' },
  von:       { nazov: 'Von a na výlet',          ikona: 'sane',     farba: '#2f7fb5' },
  tradicie:  { nazov: 'Vianočné tradície',       ikona: 'veniec',   farba: '#2f6b3a' },
  citanie:   { nazov: 'Rozprávky a čítanie',     ikona: 'kniha',    farba: '#7b4f9e' },
  hudba:     { nazov: 'Pesničky a tanec',        ikona: 'nota',     farba: '#c2477a' },
  hry:       { nazov: 'Hry a hádanky',           ikona: 'darcek',   farba: '#1f8a7a' },
  rodina:    { nazov: 'Spolu s rodinou',         ikona: 'hrncek',   farba: '#b5532f' },
  zvieratka: { nazov: 'Pre zvieratká a prírodu', ikona: 'vtacik',   farba: '#5b8c2a' },
};

const ULOHY = [
  // ---------- Dobrý skutok ----------
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'Pomôž prestrieť stôl na večeru.', n:10, i:'srdce' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'Daj každému v rodine vianočné objatie a povedz mu niečo milé.', n:5, i:'srdce' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'Pomôž vybaliť nákup a uložiť veci na miesto.', n:10, i:'darcek' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:{ m:'Vyber jednu hračku, s ktorou sa už nehráš, a darujte ju spolu deťom, ktoré ju potrebujú.', s:'Vyber jednu hračku, s ktorou sa už nehráš, a daruj ju deťom, ktoré ju potrebujú.', v:'Prejdi svoje hračky a knihy. Vyber aspoň tri veci, ktoré niekomu urobia radosť, a zaneste ich do zbierky.' }, n:20, i:'darcek', p:'hračka alebo kniha na darovanie' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'S úsmevom zaželaj pekný deň predavačke v obchode alebo pani učiteľke.', n:5, i:'srdce' },
  { c:'skutok', a:'sv',  t:'Tajný škriatok', x:'Urob niekomu z rodiny niečo pekné tak, aby nevedel, kto to bol.', n:10, i:'skriatok' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'Uprac si hračky skôr, než ťa o to niekto poprosí.', n:15, i:'hviezda' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:'Odnes susedovi medovník alebo vianočný pozdrav ako darček.', n:10, i:'medovnik', w:1, p:'medovník alebo pozdrav' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:{ m:'Zavolajte spolu babke alebo dedkovi a zaspievaj im pesničku.', s:'Zavolaj babke alebo dedkovi a porozprávaj im, čo sa ti dnes páčilo.', v:'Zavolaj babke alebo dedkovi a opýtaj sa ich, čo by im urobilo na Vianoce radosť.' }, n:10, i:'zvoncek' },
  { c:'skutok', a:'msv', t:'Dobrý skutok', x:{ m:'Nakresli obrázok pre pani kuchárku v škôlke alebo pre poštára.', s:'Nakresli ďakovný obrázok pre niekoho, kto ti pomáha – pani kuchárku, šoféra alebo poštárku.', v:'Napíš ďakovný lístok niekomu, kto ti celý rok pomáha – trénerovi, pani kuchárke alebo poštárke.' }, n:15, i:'srdce' },
  { c:'skutok', a:'sv',  t:'Dobrý skutok', x:'Urob jednu domácu prácu, ktorú zvyčajne robí niekto iný – vysávanie, utieranie prachu alebo vešanie prádla.', n:20, i:'hviezda' },
  { c:'skutok', a:'msv', t:'Za čo ďakujem', x:'Vymysli 3 veci, za ktoré si dnes {vďačný|vďačná}, a povedz ich pri večeri.', n:5, i:'svieca' },
  { c:'skutok', a:'sv',  t:'Tajný odkaz', x:'Napíš milý odkaz na lístok a schovaj ho mamine alebo ockovi do vrecka.', n:10, i:'srdce' },
  { c:'skutok', a:'v',   t:'Dobrý skutok', x:'Pomôž mladšiemu súrodencovi alebo kamarátovi s niečím, čo mu nejde – úlohou, zipsom, stavbou.', n:15, i:'srdce' },

  // ---------- Tvoríme ----------
  { c:'tvorenie', a:'msv', t:'Papierová ozdoba', x:'Vyrob ozdobu z papiera a zaves ju na stromček alebo vianočnú vetvičku.', n:20, i:'ozdoba', p:'farebný papier, nožnice, lepidlo, niť' },
  { c:'tvorenie', a:'msv', t:'Snehová vločka', x:{ m:'Rodič poskladá papier a vystrihne zúbky, ty vločku rozložíš a nalepíš na okno.', s:'Vystrihni z poskladaného papiera snehovú vločku a nalep ju na okno.', v:'Vystrihni aspoň tri rôzne snehové vločky a vyzdob nimi celé okno.' }, n:15, i:'vlocka', p:'biely papier, nožnice' },
  { c:'tvorenie', a:'msv', t:'Vianočné prianie', x:'Nakresli vianočné prianie pre kamarátku alebo kamaráta.', n:15, i:'hviezda' },
  { c:'tvorenie', a:'msv', t:'Papierová reťaz', x:'Vyrob reťaz z papierových krúžkov a ozdob ňou izbu.', n:25, i:'ozdoba', p:'pásiky farebného papiera, lepidlo' },
  { c:'tvorenie', a:'msv', t:'Moje želanie', x:'Nakresli, čo by si si {želal|želala} na Vianoce. Rodičia obrázok pošlú Ježiškovi.', n:20, i:'snehuliak' },
  { c:'tvorenie', a:'msv', t:'Trblietavé šišky', x:'Natri šišky farbou alebo ich posyp trblietkami a urob z nich vianočnú dekoráciu.', n:20, i:'stromcek', p:'šišky, farby, trblietky' },
  { c:'tvorenie', a:'sv',  t:'Pozdrav pre starkých', x:'Vyrob vianočný pozdrav pre starých rodičov a pošlite ho poštou.', n:25, i:'zvoncek', p:'výkres, pastelky, obálka, známka' },
  { c:'tvorenie', a:'msv', t:'Baliaci papier', x:'Vyrob vlastný baliaci papier: opečiatkuj obyčajný papier zemiakovou pečiatkou.', n:25, i:'darcek', p:'zemiak, farby, veľký papier', e:1 },
  { c:'tvorenie', a:'msv', t:'Vianočná dedinka', x:'Postav vianočnú dedinku z krabičiek, kartónu alebo stavebnice.', n:30, i:'domcek', w:1 },
  { c:'tvorenie', a:'msv', t:'Papierový anjelik', x:'Vyrob anjelika z papierového taniera alebo kornútika.', n:25, i:'anjel', p:'papierový tanier, nožnice, pastelky' },
  { c:'tvorenie', a:'v',   t:'Moja pohľadnica', x:'Navrhni vlastnú vianočnú pohľadnicu a napíš do nej krátku básničku s rýmom.', n:30, i:'hviezda' },
  { c:'tvorenie', a:'ms',  t:'Sob z ručičky', x:'Obtlač dlaň na papier a dokresli z nej soba alebo stromček.', n:15, i:'stromcek', p:'farby, papier' },
  { c:'tvorenie', a:'sv',  t:'Svietnik', x:'Ozdob zaváraninový pohár papierom alebo farbami a urob z neho svietnik na čajovú sviečku.', n:25, i:'svieca', p:'pohár, farby na sklo, čajová sviečka', e:1 },

  // ---------- Pečieme a varíme ----------
  { c:'kuchyna', a:'msv', t:'Pečieme medovníky!', x:'Vykrajuj tvary a ukladaj ich na plech.', n:45, i:'medovnik', w:1, e:1, p:'cesto na medovníky, formičky' },
  { c:'kuchyna', a:'msv', t:'Zdobíme medovníky', x:{ m:'Ozdob medovníky – polevou, cukrovými guličkami, ako sa ti páči.', s:'Ozdob medovníky bielou polevou.', v:'Ozdob medovníky polevou a vymysli aspoň jeden úplne nový vzor.' }, n:40, i:'medovnik', w:1, p:'poleva, cukrové zdobenie' },
  { c:'kuchyna', a:'msv', t:'Vianočné pečivo', x:'Upeč s rodičmi vianočné pečivo – linecké, vanilkové rožky alebo kokosky.', n:60, i:'medovnik', w:1, e:1 },
  { c:'kuchyna', a:'sv',  t:'Horúce kakao', x:'Priprav pre rodinu horúce kakao a podávaj ho s úsmevom.', n:15, i:'hrncek', e:1 },
  { c:'kuchyna', a:'sv',  t:'Štedrá večera', x:'Navrhni menu na Štedrú večeru a nakresli ho ako v reštaurácii.', n:20, i:'hviezda' },
  { c:'kuchyna', a:'msv', t:'Ovocný stromček', x:'Poskladaj na tanier stromček alebo snehuliaka z ovocia a zjedzte ho na desiatu.', n:15, i:'stromcek', p:'ovocie' },
  { c:'kuchyna', a:'v',   t:'Malý pekár', x:'Prečítaj recept a samostatne odmeraj všetky suroviny na vianočné koláčiky.', n:30, i:'medovnik', w:1 },
  { c:'kuchyna', a:'msv', t:'Voňavý pomaranč', x:'Napichaj do pomaranča klinčeky. Bude voňať celý advent.', n:15, i:'ozdoba', p:'pomaranč, klinčeky' },
  { c:'kuchyna', a:'ms',  t:'Malý pomocník', x:'Pomôž umiesiť cesto na vianočku alebo pizzu.', n:30, i:'hrncek', e:1 },

  // ---------- Von a na výlet ----------
  { c:'von', a:'msv', t:'Výlet', x:'Korčuľovanie alebo návšteva vianočných trhov.', n:120, i:'sane', w:1, o:1, k:1 },
  { c:'von', a:'msv', t:'Svetielka', x:'Prechádzka za tmy: hľadajte dom s najkrajšou vianočnou výzdobou.', n:30, i:'domcek', o:1 },
  { c:'von', a:'msv', t:'Snehuliak', x:'Ak napadol sneh, postav snehuliaka. Ak nie, nazbieraj na prechádzke šišky.', n:30, i:'snehuliak', o:1 },
  { c:'von', a:'msv', t:'Zimná túra', x:'Choďte sa sánkovať alebo na zimnú prechádzku do lesa.', n:120, i:'sane', w:1, o:1 },
  { c:'von', a:'msv', t:'Prírodná výzdoba', x:'Nazbieraj v prírode vetvičky, šišky a mach na vianočnú výzdobu.', n:40, i:'stromcek', o:1 },
  { c:'von', a:'msv', t:'Knižnica', x:'Navštívte knižnicu a požičajte si vianočnú knihu.', n:45, i:'kniha', w:1 },
  { c:'von', a:'msv', t:'Stromček na námestí', x:'Choďte sa pozrieť na vianočný stromček na námestí a odfoťte sa pri ňom.', n:45, i:'stromcek', o:1 },
  { c:'von', a:'v',   t:'Dnes vedieš ty', x:'Naplánuj na mape trasu rodinnej zimnej vychádzky a buď dnes {sprievodca|sprievodkyňa}.', n:90, i:'mapa', w:1, o:1 },

  // ---------- Vianočné tradície ----------
  { c:'tradicie', a:'sv',  t:'Ondrejský večer', x:'Podľa starého zvyku sa na Ondreja lialo olovo. Skúste liať vosk do studenej vody a hádajte, čo tvar pripomína.', d:'11-30', n:20, i:'svieca', e:1 },
  { c:'tradicie', a:'msv', t:'Barborka', x:'Daj do vázy s vodou halúzku čerešne. Ak rozkvitne do Vianoc, prinesie šťastie!', d:'12-04', n:10, i:'vetvicka' },
  { c:'tradicie', a:'msv', t:'Čižmička pre Mikuláša', x:'Vyčisti a vyleští si čižmičku a polož ju na okno pre Mikuláša.', d:'12-05', n:15, i:'cizma' },
  { c:'tradicie', a:'msv', t:'Mikuláš je tu!', x:'Nauč sa krátku básničku alebo pesničku a zarecituj ju rodine.', d:'12-06', n:15, i:'cizma' },
  { c:'tradicie', a:'msv', t:'Lucia', x:'Na Luciu sa podľa tradície vymetali kúty husím pierkom. Pomôž upratať jeden kútik domu.', d:'12-13', n:15, i:'hviezda' },
  { c:'tradicie', a:'msv', t:'Najkratší deň', x:'Dnes je najkratší deň v roku. Zapáľte večer sviečky a porozprávajte sa pri nich.', d:'12-21', n:20, i:'svieca' },
  { c:'tradicie', a:'msv', t:'Štedrý deň', x:'Pomôž prestrieť sviatočný stôl a daj každému pod tanier šupinku z kapra pre šťastie.', d:'12-24', n:20, i:'stromcek' },
  { c:'tradicie', a:'msv', t:'Adventný veniec', x:'Vyrob alebo ozdob s rodičmi adventný veniec.', n:30, i:'veniec', w:1, p:'veniec, 4 sviečky, stužky' },
  { c:'tradicie', a:'sv',  t:'Ako to bolo kedysi', x:'Opýtaj sa babky alebo dedka, ako vyzerali Vianoce, keď boli malí.', n:20, i:'hrncek' },
  { c:'tradicie', a:'msv', t:'Betlehem', x:'Postavte doma betlehem a porozprávaj, kto všetko v ňom je.', n:30, i:'hviezda', r:1, w:1 },
  { c:'tradicie', a:'msv', t:'Príbeh o Ježiškovi', x:'Prečítajte si spolu príbeh o narodení Ježiška.', n:15, i:'anjel', r:1 },
  { c:'tradicie', a:'sv',  t:'Vianočné zvyky', x:'Zistite, aké vianočné zvyky máme na Slovensku, napríklad krájanie jablka alebo orechové lodičky.', n:20, i:'zvoncek' },
  { c:'tradicie', a:'msv', t:'Ozdobíme stromček', x:'Pomôž ozdobiť vianočný stromček.', n:45, i:'stromcek', w:1 },

  // ---------- Rozprávky a čítanie ----------
  { c:'citanie', a:'msv', t:'Večer pri sviečke', x:'Vyber si vianočnú rozprávku na čítanie pred spaním.', n:20, i:'kniha' },
  { c:'citanie', a:'v',   t:'Čítam nahlas', x:'Prečítaj mladšiemu súrodencovi alebo rodičom vianočný príbeh nahlas.', n:20, i:'kniha' },
  { c:'citanie', a:'msv', t:'Naša rozprávka', x:'Vymyslite spolu rozprávku o snehuliakovi, ktorý sa bál zimy.', n:15, i:'snehuliak' },
  { c:'citanie', a:'msv', t:'Rodinné kino', x:'Pozrite si spolu vianočnú rozprávku – s dekou a popcornom.', n:90, i:'hviezda', w:1 },
  { c:'citanie', a:'sv',  t:'List Ježiškovi', x:'Napíš list Ježiškovi – nielen o darčekoch, ale aj o tom, čo sa ti tento rok podarilo.', n:25, i:'anjel' },
  { c:'citanie', a:'m',   t:'Hľadáme v knižke', x:'Prezeraj s rodičom obrázkovú knižku a nájdi na obrázkoch všetko vianočné.', n:15, i:'kniha' },

  // ---------- Pesničky a tanec ----------
  { c:'hudba', a:'msv', t:'Tichá noc', x:'Vypočuj si koledu Tichá noc a zaspievaj s rodičmi aspoň začiatok.', n:10, i:'nota' },
  { c:'hudba', a:'msv', t:'Vianočná diskotéka', x:'Zatancuj si s rodinou na vianočné pesničky.', n:20, i:'nota' },
  { c:'hudba', a:'sv',  t:'Nová koleda', x:'Nauč sa novú koledu a zaspievaj ju pri večeri.', n:20, i:'zvoncek' },
  { c:'hudba', a:'msv', t:'Rolničky', x:'Vyrob hrkálku z krabičky a gombíkov a zahraj na nej ku kolede.', n:20, i:'zvoncek', p:'krabička, gombíky alebo ryža' },
  { c:'hudba', a:'v',   t:'Rodinný playlist', x:'Zostav zoznam 10 vianočných pesničiek, ktoré bude počúvať celá rodina.', n:20, i:'nota' },
  { c:'hudba', a:'sv',  t:'Uhádni koledu', x:'Jeden bzučí melódiu, ostatní hádajú, aká je to koleda.', n:15, i:'nota' },

  // ---------- Hry a hádanky ----------
  { c:'hry', a:'msv', t:'Spoločenská hra', x:'Zahrajte si spoločenskú hru. Kto vyhrá, vyberá zajtrajšiu rozprávku.', n:30, i:'darcek' },
  { c:'hry', a:'msv', t:'Hľadanie prekvapenia', x:'Rodičia schovali malé prekvapenie. Hľadaj ho podľa nápovedy „teplo – zima“.', n:15, i:'darcek', p:'malé prekvapenie na schovanie' },
  { c:'hry', a:'msv', t:'Pevnosť z diek', x:'Postavte z diek a vankúšov pevnosť a urobte si v nej piknik.', n:60, i:'domcek', w:1 },
  { c:'hry', a:'msv', t:'Vianočné bingo', x:'Na prechádzke hľadaj: hviezdu, sviečku, stromček, soba a darček.', n:30, i:'hviezda', o:1 },
  { c:'hry', a:'ms',  t:'Zamrznutý snehuliak', x:'Tancuj pri vianočnej hudbe. Keď hudba stíchne, zamrzni ako snehuliak!', n:10, i:'snehuliak' },
  { c:'hry', a:'v',   t:'Moje hádanky', x:'Vymysli 5 vianočných hádaniek a nechaj rodinu hádať.', n:20, i:'hviezda' },
  { c:'hry', a:'ms',  t:'Pexeso', x:'Nakreslite si vlastné vianočné pexeso a zahrajte si ho.', n:30, i:'ozdoba', p:'výkres, nožnice' },
  { c:'hry', a:'v',   t:'Rodinný kvíz', x:'Priprav rodinný vianočný kvíz. Každý vymyslí 3 otázky pre ostatných.', n:30, i:'zvoncek' },

  // ---------- Spolu s rodinou ----------
  { c:'rodina', a:'msv', t:'Spomienky', x:'Prezrite si pri kakau fotky z minulých Vianoc.', n:30, i:'hrncek' },
  { c:'rodina', a:'sv',  t:'Dávno sme sa nevideli', x:'Zavolaj niekomu, koho si dlho {nevidel|nevidela}, a zaželaj mu krásny advent.', n:10, i:'zvoncek' },
  { c:'rodina', a:'msv', t:'Čo sa mi na tebe páči', x:'Pri večeri povedz každému, čo sa ti na ňom páči.', n:10, i:'srdce' },
  { c:'rodina', a:'sv',  t:'Želania bez darčekov', x:'Napíšte spolu zoznam vianočných želaní – nie vecí, ale zážitkov.', n:20, i:'hviezda' },
  { c:'rodina', a:'msv', t:'Vianočná fotka', x:'Urobte si rodinnú fotku vo vianočných svetroch alebo čiapkach.', n:15, i:'snehuliak' },
  { c:'rodina', a:'sv',  t:'Večer bez obrazoviek', x:'Celý večer bez televízora a mobilov: hry, rozhovory a čaj.', n:120, i:'svieca' },

  // ---------- Pre zvieratká a prírodu ----------
  { c:'zvieratka', a:'msv', t:'Kŕmidlo pre vtáčiky', x:'Urob kŕmidlo zo šišky, masti a semienok a zaves ho von.', n:25, i:'vtacik', p:'šiška, masť, semienka, motúz', e:1 },
  { c:'zvieratka', a:'msv', t:'Kto priletel?', x:'Nasyp vtáčikom do kŕmidla slnečnicové semienka a pozoruj, kto priletí.', n:15, i:'vtacik', p:'slnečnicové semienka' },
  { c:'zvieratka', a:'msv', t:'Vtáky za oknom', x:'Nakresli všetky vtáky, ktoré dnes uvidíš za oknom.', n:15, i:'vtacik' },
  { c:'zvieratka', a:'sv',  t:'Darček pre zvieratko', x:'Prines deku alebo krmivo do útulku pre zvieratká.', n:60, i:'srdce', w:1, k:1 },
  { c:'zvieratka', a:'msv', t:'Voda pre vtáčiky', x:'Polož von misku s vodou. V zime vtáčiky nemajú kde piť.', n:5, i:'vtacik' },
  { c:'zvieratka', a:'v',   t:'Ako zimujú zvieratá', x:'Zisti, ako zimujú ježkovia, medvede a sťahovavé vtáky, a povedz to rodine pri večeri.', n:25, i:'vtacik' },
];

/* Špeciálne kartičky, ktoré program dopĺňa sám */
const SPECIALNE = {
  nedela: { c:'tradicie', a:'msv', t:'{n}. adventná nedeľa', x:'Zapáľ s rodinou {n}. sviečku na adventnom venci.', i:'veniec' },
  posledna: { c:'hry', a:'msv', t:'Posledné okienko!', x:'Podľa mapy nájdi poklad.', i:'mapa', p:'mapa pokladu a poklad' },
};

/* Hádanky (v3) – odpoveď sa tlačí hore nohami */
const HADANKY = [
  { a:'sv', q:'Biely som, v zime rastiem a na slnku sa strácam. Kto som?', o:'snehuliak' },
  { a:'sv', q:'Padá z neba, nie je to dážď, je biely a studený. Čo je to?', o:'sneh' },
  { a:'sv', q:'Mám knôt a svetlo. Keď ma zapáliš, pomaly sa zmenšujem.', o:'sviečka' },
  { a:'sv', q:'Je zelený v lete aj v zime a na Vianoce svieti.', o:'vianočný stromček' },
  { a:'sv', q:'Visí na stromčeku, je okrúhla, lesklá a ľahko sa rozbije.', o:'vianočná guľa' },
  { a:'sv', q:'Upečú ma, ozdobia ma a voniam perníkom a škoricou.', o:'medovník' },
  { a:'sv', q:'Chodí 5. decembra večer, má bielu bradu a nosí sladkosti.', o:'Mikuláš' },
  { a:'sv', q:'Mám parohy, žijem na severe a ťahám sane plné darčekov.', o:'sob' },
  { a:'v',  q:'Čím viac z nej berieš, tým je väčšia. Čo je to?', o:'jama' },
  { a:'v',  q:'Ktorý mesiac má 28 dní?', o:'všetky' },
  { a:'v',  q:'Patrí tebe, ale ostatní to používajú častejšie ako ty.', o:'tvoje meno' },
  { a:'v',  q:'Má krk, ale nemá hlavu.', o:'fľaša' },
  { a:'v',  q:'Čo je ťažšie: kilo peria, alebo kilo kapra?', o:'rovnako ťažké' },
  { a:'v',  q:'Keď ma vyslovíš, už ma niet.', o:'ticho' },
  { a:'v',  q:'Mám kľúče, ale žiadne dvere neodomknem. Hrá sa na mne koleda.', o:'klavír' },
  { a:'sv', q:'Ide hore aj dole, a pritom stojí na mieste.', o:'schody' },
];

/* Výzvy navyše pre staršie deti (v3) – na víkendové kartičky */
const VYZVY = [
  'Vydrž celý deň bez jediného sťažovania sa.',
  'Nauč sa povedať „Veselé Vianoce“ v troch jazykoch.',
  'Vypočítaj, koľko hodín zostáva do Štedrého večera.',
  'Urob 20 drepov počas jednej koledy.',
  'Napíš básničku so slovami sneh, darček a kapor.',
  'Vymysli novú vianočnú tradíciu pre vašu rodinu.',
  'Zisti, kto nosí darčeky deťom v piatich iných krajinách.',
  'Celý deň hovor len pekné veci – aj o súrodencoch.',
  'Uprac jednu zásuvku tak, aby to nikto nemusel kontrolovať.',
  'Nakresli mapu vášho bytu alebo domu z vtáčej perspektívy.',
];

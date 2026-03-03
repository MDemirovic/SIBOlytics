import { EducationSection } from './educationSections';

export const educationSectionsHr: EducationSection[] = [
  {
    id: 'what-is-sibo',
    title: '1. Što je SIBO i sindrom prekomjernog rasta mikroba?',
    summary:
      'SIBO (prekomjerni rast bakterija tankog crijeva) spada u širu skupinu sindroma gdje se bakterije ili arheje nenormalno nakupljaju u tankom crijevu.',
    bullets: [
      'SIBO obilježava povišen broj bakterija u tankom crijevu, često uz vrste poput E. coli i Klebsiella.',
      'Te bakterije brzo fermentiraju ugljikohidrate i stvaraju velike količine plinova.',
      'Srodni poremećaji uključuju IMO (metanski overgrowth) i povišenu proizvodnju H2S plina.',
      'Nije samo problem "bakterija iz kolona", nego preuzimanje tankog crijeva od specifičnih mikroba.',
    ],
    evidenceNote: 'Temeljeno na Pimentelovoj i konsenzusnoj literaturi; edukativno.',
  },
  {
    id: 'sibo-and-ibs',
    title: '2. Kako je SIBO povezan s IBS-om',
    summary:
      'IBS se dugo smatrao "krovnom" dijagnozom, ali istraživanja pokazuju veliko preklapanje sa SIBO/IMO obrascima.',
    bullets: [
      'Značajan dio IBS slučajeva (osobito IBS-D i IBS-C) može biti povezan sa SIBO-om ili IMO-om.',
      'IBS se često postavlja kao dijagnoza isključenja kada su druge pretrage uredne.',
      'Prepoznavanje SIBO obrasca pomiče fokus s općeg "sindroma" na mjerljiv disbalans mikroba.',
    ],
    evidenceNote: 'Temeljeno na Pimentelovoj i konsenzusnoj literaturi; edukativno.',
  },
  {
    id: 'root-causes-motility',
    title: '3. Korijenski uzroci i migrirajući motorički kompleks (MMC)',
    summary:
      'SIBO najčešće nastaje kada je narušen mehanizam čišćenja tankog crijeva, posebno MMC.',
    bullets: [
      'MMC djeluje kao "val čišćenja" koji tijekom posta pomiče ostatke hrane i mikrobe prema dolje.',
      'Kad je MMC usporen ili narušen, mikrobi se lakše množe i zadržavaju.',
      'Dodatni uzroci mogu biti adhezije, endometrioza, određeni lijekovi i imunološki čimbenici.',
    ],
    evidenceNote: 'Temeljeno na Pimentelovoj i konsenzusnoj literaturi; edukativno.',
  },
  {
    id: 'post-infectious-ibs',
    title: '4. Postinfektivni IBS (veza s trovanjem hranom)',
    summary:
      'Jedan od čestih okidača SIBO/IBS simptoma je preboljena akutna crijevna infekcija.',
    bullets: [
      'Patogeni poput Campylobacter, E. coli i Salmonella mogu otpuštati toksin CdtB.',
      'Imunološki odgovor na CdtB može križno reagirati s vinculin proteinom u crijevu.',
      'To može oštetiti živce uključene u MMC i dovesti do motilitetnog poremećaja te overgrowtha.',
      'Nakon težih infekcija povećava se rizik razvoja trajnih IBS simptoma.',
    ],
    evidenceNote: 'Temeljeno na Pimentelovoj i konsenzusnoj literaturi; edukativno.',
  },
  {
    id: 'antibodies',
    title: '5. Antitijela (Anti-CdtB i Anti-Vinculin)',
    summary:
      'Krvni markeri mogu pomoći prepoznati postinfektivni mehanizam i procijeniti motilitetni rizik.',
    bullets: [
      'Anti-CdtB i anti-vinculin testovi mogu poduprijeti sumnju na postinfektivni mehanizam.',
      'Povišeni anti-vinculin može upućivati na trajniju neuromotornu disfunkciju crijeva.',
      'Markeri su korisni osobito kod IBS-D i mješovitih obrazaca, uz oprez u tumačenju.',
      'Praćenje kroz vrijeme može pomoći u planiranju trajanja motilitetne potpore.',
    ],
    evidenceNote: 'Edukativno; nije medicinska dijagnoza.',
  },
  {
    id: 'breath-testing-basics',
    title: '6. Osnove izdisajnog testa',
    summary:
      'Izdisajni test mjeri plinove koje mikrobi stvaraju nakon unosa testnog supstrata.',
    bullets: [
      'Najčešći supstrati su laktuloza i glukoza.',
      'Porast vodika >=20 ppm unutar 90 minuta je standardni prag za pozitivan vodikov obrazac.',
      'Rani porast (<=90 min) više govori za tanko crijevo, kasni porast češće govori za kolon.',
      'Rezultat je kvantitativan i treba ga tumačiti zajedno sa simptomima i pripremom prije testa.',
    ],
    evidenceNote: 'Temeljeno na North American Consensus i Pimentel literaturi; edukativno.',
  },
  {
    id: 'three-gas-testing',
    title: '7. Testiranje tri plina (H2, CH4, H2S)',
    summary:
      'Moderni testovi uključuju vodik, metan i sumporovodik za cjelovitiju sliku.',
    bullets: [
      'Vodik (H2): češće povezan s proljevom i nadutošću.',
      'Metan (CH4): povezan sa zatvorom i usporenim prolazom.',
      'Sumporovodik (H2S): može biti povezan s hitnošću, bolom i težom dijarejom.',
      'Mjerenje više plinova smanjuje rizik lažno negativnog tumačenja.',
    ],
    evidenceNote: 'Temeljeno na suvremenoj literaturi o izdisajnom testiranju; edukativno.',
  },
  {
    id: 'patterns-overview',
    title: '8. Najčešći obrasci plinova',
    summary:
      'Različiti obrasci plinova često prate različite dominantne simptome.',
    bullets: [
      'Vodik-dominantan obrazac: češće proljev, nadutost i brza fermentacija.',
      'Metan-dominantan (IMO): češće zatvor i usporen tranzit.',
      'H2S-dominantan: češće jača dijareja, hitnost i visceralna preosjetljivost.',
      'Mješoviti obrasci su mogući i mogu davati promjenjive navike stolice.',
    ],
    evidenceNote: 'Edukativni sažetak obrazaca; nije dijagnoza.',
  },
  {
    id: 'treatment-approaches',
    title: '9. Edukativni pregled terapijskih pristupa',
    summary:
      'Pristupi liječenju ciljaju smanjenje overgrowtha i poboljšanje motiliteta.',
    bullets: [
      'Antibiotski protokoli biraju se prema dominantnom plinskom obrascu.',
      'Kod metana se u praksi često koristi kombinirani pristup.',
      'Elementalna prehrana može biti opcija u odabranim slučajevima.',
      'Prevencija relapsa često uključuje rad na motilitetu i triggerima.',
      'Sve terapijske odluke treba voditi uz nadzor gastroenterologa.',
    ],
    evidenceNote: 'Edukativno; ne započinjati terapiju bez medicinskog nadzora.',
  },
  {
    id: 'common-misconceptions',
    title: '10. Česte zablude',
    summary:
      'Neke stare pretpostavke o IBS/SIBO-u više nisu u skladu s novijim dokazima.',
    bullets: [
      '"IBS je samo psihološki problem" - netočno; postoji jasna biološka komponenta.',
      '"SIBO je samo pomak kolon bakterija prema gore" - pojednostavljeno i često netočno.',
      '"Probiotici uvijek pomažu" - učinak je individualan i nekad mogu pogoršati simptome.',
      '"Restriktivna prehrana mora biti trajna" - najčešće je to privremeni alat, ne trajno rješenje.',
    ],
    evidenceNote: 'Edukativni sažetak; individualna procjena je obavezna.',
  },
  {
    id: 'when-to-seek-care',
    title: '11. Kada potražiti liječničku pomoć',
    summary:
      'Neki simptomi zahtijevaju brzu medicinsku obradu radi isključenja ozbiljnijih uzroka.',
    bullets: [
      'Nenamjerni i izraženi gubitak tjelesne težine.',
      'Krv u stolici ili jaka, stalna bol u trbuhu.',
      'Simptomi koji bude iz sna.',
      'Anemija ili neobjašnjivi nutritivni deficiti.',
      'Neuspjeh terapija zahtijeva dodatnu obradu (npr. adhezije, IBD, endometrioza).',
    ],
    evidenceNote: 'Ako postoje alarmni simptomi, potrebna je brza procjena liječnika.',
  },
  {
    id: 'faq',
    title: '12. Česta pitanja',
    summary:
      'Kratki odgovori na česta pitanja o SIBO/IMO upravljanju.',
    bullets: [
      'Endometrioza može mehanički utjecati na motilitet i pridonijeti simptomima.',
      'Reakcija na hranu može kasniti 24-72 sata, pa je strukturirano praćenje važno.',
      'Metan obrazac može biti povezan s težim mršavljenjem kod dijela pacijenata.',
      'Kontrolno testiranje se obično planira nakon kliničke procjene i adekvatnog razmaka od terapije.',
    ],
    evidenceNote: 'Edukativno; individualni plan donosi se s liječnikom.',
  },
  {
    id: 'practical-reading-framework',
    title: '13. Praktično čitanje izdisajnog testa (Pimentel okvir)',
    summary:
      'Praktičan redoslijed tumačenja SIBO/IMO nalaza u kliničkoj praksi.',
    bullets: [
      'Korak 1: prvo pogledati bazalne vrijednosti, zatim prvih 90 minuta.',
      'Korak 2: H2 pozitivan obrazac = porast >=20 ppm do 90. minute.',
      'Korak 3: CH4/IMO pozitivan obrazac = metan >=10 ppm u bilo kojoj točki testa.',
      'Korak 4: izolirani kasni porast H2 češće govori za kolonsku fermentaciju.',
      'Korak 5: supstrat je bitan (glukoza specifičnija; laktuloza osjetljivija).',
      'Korak 6: plinovi + simptomi + kvaliteta pripreme zajedno vode odluku.',
    ],
    evidenceNote: 'Edukativni okvir prema konsenzusu i Pimentel literaturi; nije dijagnoza.',
    optionalLinks: [
      {
        label: 'North American Consensus o izdisajnom testiranju (2017)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28323273/',
      },
      {
        label: 'ACG smjernice: SIBO (2020)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32023228/',
      },
      {
        label: 'Metan i usporenje tranzita (Pimentel i sur., 2006)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16630746/',
      },
      {
        label: 'Postinfektivni IBS biomarkeri (Pimentel i sur., 2015)',
        url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0126438',
      },
    ],
  },
];

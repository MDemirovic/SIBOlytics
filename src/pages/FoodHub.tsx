import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { foods, FoodItem } from '../data/foods_from_pdf';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface LoggedFood {
  id: string;
  name: string;
  amount: string;
  status: 'safe' | 'caution' | 'trigger';
  notes?: string;
  createdAt: string;
}

const HR_FOOD_CATEGORY_MAP: Record<string, string> = {
  Fruits: 'Voće',
  Vegetables: 'Povrće',
  'Nuts and Seeds': 'Orasasti plodovi i sjemenke',
  'Grains and Starches': 'Žitarice i škrob',
  Proteins: 'Proteini',
  'Dairy / Dairy Alternatives': 'Mliječni proizvodi / zamjene',
  Beverages: 'Pića',
  'Fats and Oils': 'Masti i ulja',
  'Condiments, Seasonings, and Baking Supplies': 'Dodaci, začini i sastojci za pečenje',
  Sweeteners: 'Zaslađivači',
  'Sweets and Desserts': 'Slatko i deserti',
  'High-FODMAP Checklist': 'Visoki FODMAP popis',
};

const HR_FOOD_NAME_MAP: Record<string, string> = {
  Bananas: 'Banane',
  Blueberries: 'Borovnice',
  Cantaloupe: 'Dinja',
  Clementine: 'Klementina',
  Cranberries: 'Brusnice',
  'Honeydew melon': 'Medna dinja',
  Kiwi: 'Kivi',
  Lemon: 'Limun',
  Lime: 'Limeta',
  Orange: 'Naranca',
  'Passion fruit': 'Marakuja',
  Pineapple: 'Ananas',
  Raisins: 'Grozdice',
  Starfruit: 'Karambola',
  Strawberries: 'Jagode',
  Alfalfa: 'Lucerna',
  Arugula: 'Rikola',
  'Bamboo shoots': 'Izdanci bambusa',
  'Bean sprouts': 'Klice graha',
  'Bell peppers': 'Paprika',
  Broccoli: 'Brokula',
  Celery: 'Celer',
  Cucumber: 'Krastavac',
  Eggplant: 'Patlidzan',
  Endive: 'Endivija',
  Fennel: 'Komorac',
  'Green beans': 'Zelene mahune',
  Kale: 'Kelj',
  Lettuce: 'Salata',
  Okra: 'Okra',
  Potato: 'Krumpir',
  Rutabaga: 'Zuta repa',
  'Spaghetti squash': 'Spageti tikva',
  Spinach: 'Spinat',
  'Summer squash': 'Ljetna tikva',
  'Spring onion': 'Mladi luk',
  Tomatoes: 'Rajcice',
  Turnips: 'Repa',
  Yam: 'Jam',
  Zucchini: 'Tikvice',
  Almonds: 'Bademi',
  Cornmeal: 'Kukuruzno brasno',
  'Corn tortillas/chips': 'Kukuruzne tortilje/cips',
  'Gluten-free bread': 'Bezglutenski kruh',
  Grits: 'Kukuruzna krupica',
  Millet: 'Proso',
  Oats: 'Zob',
  'Popcorn (plain or salted)': 'Kokice (obicne ili slane)',
  'Potato chips (plain)': 'Cips od krumpira (obicni)',
  Quinoa: 'Kvinoja',
  Rice: 'Riza',
  'Rice cakes': 'Rizini krekeri',
  'Rice noodles': 'Rizini rezanci',
  Tapioca: 'Tapioka',
  Yams: 'Jam',
  Beef: 'Govedina',
  Chicken: 'Piletina',
  'Eggs / egg substitute': 'Jaja / zamjena za jaja',
  Fish: 'Riba',
  Lamb: 'Janjetina',
  Pork: 'Svinjetina',
  Shellfish: 'Skoljkasi',
  Turkey: 'Puretina',
  Chickpeas: 'Slanutak',
  Tempeh: 'Tempeh',
  Tofu: 'Tofu',
  'Almond Milk': 'Bademovo mlijeko',
  'Cheese (aged, including cheddar, swiss, parmesan, brie, havarti, camembert)': 'Sir (odlezani: cheddar, swiss, parmezan, brie, havarti, camembert)',
  'Cheese (not aged, including feta, American, mozzarella, fresh chevre, queso fresco)': 'Sir (svjezi: feta, americki, mozzarella, svjezi kozji, queso fresco)',
  'Lactose-free kefir': 'Kefir bez laktoze',
  'Lactose-free sour cream': 'Kiselo vrhnje bez laktoze',
  'Lactose-free yogurt (plain)': 'Jogurt bez laktoze (obicni)',
  'Rice milk': 'Rizino mlijeko',
  Beer: 'Pivo',
  'Black tea': 'Crni caj',
  Espresso: 'Espresso',
  Gin: 'Gin',
  'Ginger tea': 'Caj od djumbira',
  'Green tea': 'Zeleni caj',
  'Peppermint tea': 'Caj od paprene metvice',
  'Rooibos tea': 'Rooibos caj',
  Water: 'Voda',
  Whiskey: 'Viski',
  'White tea': 'Bijeli caj',
  Wine: 'Vino',
  Avocado: 'Avokado',
  Margarine: 'Margarin',
  Oil: 'Ulje',
  Asafoetida: 'Asafetida',
  'Bakers yeast': 'Pekarski kvasac',
  'Baking powder/soda': 'Prasak za pecivo / soda bikarbona',
  Basil: 'Bosiljak',
  'Bay leaf': 'Lovor',
  'Black pepper': 'Crni papar',
  Capers: 'Kapare',
  Cardamom: 'Kardamom',
  'Chili powder': 'Cili u prahu',
  Cilantro: 'Korijander (list)',
  Cinnamon: 'Cimet',
  'Cocoa powder': 'Kakao u prahu',
  Coriander: 'Korijander',
  Cumin: 'Kim',
  'Curry powder': 'Curry u prahu',
  'Fennel seeds': 'Sjemenke komoraca',
  'Five spice': 'Mjesavina pet zacina',
  Ginger: 'Djumbir',
  Lemongrass: 'Limunska trava',
  Marjoram: 'Majoran',
  Mint: 'Metvica',
  Mayonnaise: 'Majoneza',
  Mustard: 'Senf',
  Nutmeg: 'Muskatni orascic',
  Olives: 'Masline',
  Oregano: 'Origano',
  Paprika: 'Paprika',
  Parsley: 'Persin',
  Pectin: 'Pektin',
  Rosemary: 'Ruzmarin',
  Saffron: 'Safran',
  Salt: 'Sol',
  'Sesame oil': 'Sezamovo ulje',
  'Star anise': 'Zvjezdasti anis',
  'Soy sauce': 'Sojin umak',
  Tamari: 'Tamari',
  Tarragon: 'Estragon',
  'Tomato paste': 'Pire od rajcice',
  Thyme: 'Majcina dusica',
  Turmeric: 'Kurkuma',
  Vanilla: 'Vanilija',
  Vinegar: 'Ocat',
  'Worcestershire sauce': 'Worcestershire umak',
  'Xanthan gum': 'Ksantan guma',
  Agave: 'Agava',
  Allspice: 'Piment',
  'Almond butter': 'Bademov maslac',
  Apples: 'Jabuke',
  apricots: 'Marelice',
  Artichokes: 'Articoke',
  'Artificial sweeteners not ending in “-ol”': 'Umjetna sladila koja ne zavrsavaju na "-ol"',
  Asparagus: 'Sparoge',
  Aspartame: 'Aspartam',
  'baked beans': 'Peceni grah',
  'Banana (ripe)': 'Banana (zrela)',
  barley: 'Jecam',
  'black beans': 'Crni grah',
  blackberries: 'Kupine',
  'Bok choy': 'Pak choi',
  'Brazil nuts': 'Brazilski orasi',
  'Breakfast cereals made of rice or corn (e.g. corn flakes, rice krispies': 'Zitarice za dorucak od rize ili kukuruza (npr. corn flakes, rice krispies)',
  'Brown sugar': 'Smedi secer',
  'Brussels sprouts': 'Prokulice',
  Buckwheat: 'Heljda',
  Butter: 'Maslac',
  'Butternut squash': 'Butternut tikva',
  Candy: 'Bomboni',
  'Cane sugar or syrup': 'Secer od trske ili sirup',
  carob: 'Rogac',
  Carrots: 'Mrkva',
  'Caster sugar': 'Fini kristal secer',
  Cauliflower: 'Cvjetaca',
  'chamomile tea': 'Caj od kamilice',
  cherries: 'Tresnje',
  Chestnuts: 'Kesteni',
  'Chia seeds': 'Chia sjemenke',
  'chicory root': 'Korijen cikorije',
  Chives: 'Vlasac',
  Cocoa: 'Kakao',
  Coconut: 'Kokos',
  'Coconut milk': 'Kokosovo mlijeko',
  'Coconut sugar': 'Kokosov secer',
  Coffee: 'Kava',
  Corn: 'Kukuruz',
  'Corn starch': 'Kukuruzni skrob',
  'Corn syrup (NOT high-fructose)': 'Kukuruzni sirup (NE visokofruktozni)',
  'cottage cheese': 'Svjezi sir',
  'Cream cheese': 'Krem sir',
  currants: 'Ribiz',
  custard: 'Krema od pudinga',
  'Dark or semisweet chocolate': 'Tamna ili poluslatka cokolada',
  dates: 'Datulje',
  Dextrose: 'Dekstroza',
  'dried figs': 'Suhe smokve',
  Edamame: 'Edamame',
  'Evaporated milk': 'Evaporirano mlijeko',
  'fava beans': 'Bob',
  'fennel tea': 'Caj od komoraca',
  'FOS (fructo-oligosaccharide)': 'FOS (frukto-oligosaharidi)',
  'fresh figs': 'Svjeze smokve',
  garlic: 'Cesnjak',
  'Ginger root': 'Korijen djumbira',
  Glucose: 'Glukoza',
  'Gluten-free pasta': 'Bezglutenska tjestenina',
  'Gluten-free pretzels': 'Bezglutenski pereci',
  'Golden syrup': 'Zlatni sirup',
  'Granulated or table sugar': 'Kristalni ili stolni secer',
  grapefruit: 'Grejp',
  Grapes: 'Grozde',
  'Half and Half': 'Pola vrhnje pola mlijeko',
  'Heavy cream': 'Vrhnje za kuhanje',
  'high fructose corn syrup': 'Visokofruktozni kukuruzni sirup',
  honey: 'Med',
  'ice cream': 'Sladoled',
  inulin: 'Inulin',
  isomalt: 'Izomalt',
  'Jam or jelly': 'Dzem ili zele',
  'kidney beans': 'Crveni grah',
  'Lactose-free cottage cheese': 'Svjezi sir bez laktoze',
  'leek and scallion bulbs': 'Poriluk i mladi luk (bijeli dio)',
  Lentils: 'Leca',
  Maltose: 'Maltoza',
  mango: 'Mango',
  mannitol: 'Manitol',
  'Maple Syrup (100% pure)': 'Javorov sirup (100% cisti)',
  'Mature soybeans (most soy milk and soy flour)': 'Zrela soja (vecina sojinog mlijeka i brasna)',
  'Milk (cow, sheep, goat)': 'Mlijeko (kravlje, ovcje, kozje)',
  mushrooms: 'Gljive',
  'navy beans': 'Bijeli grah',
  nectarine: 'Nektarina',
  nectarines: 'Nektarine',
  'onion and garlic powder': 'Luk i cesnjak u prahu',
  onions: 'Luk',
  'Oolong tea': 'Oolong caj',
  'Palm sugar': 'Palmin secer',
  Parsnip: 'Pastrnjak',
  'Peanut butter': 'Maslac od kikirikija',
  Peanuts: 'Kikiriki',
  pears: 'Kruske',
  peas: 'Grasak',
  Pecans: 'Pekan orasi',
  persimmon: 'Kaki',
  'Pine nuts': 'Pinjoli',
  plums: 'Sljive',
  Polenta: 'Palenta',
  'Poppy seeds': 'Mak',
  prunes: 'Suhe sljive',
  'Pumpkin seeds': 'Bucine sjemenke',
  Radish: 'Rotkvica',
  'Raw sugar': 'Sirovi secer',
  Rhubarb: 'Rabarbara',
  'Ricotta cheese': 'Ricotta sir',
  Rum: 'Rum',
  Rye: 'Raz',
  Saccharine: 'Saharin',
  Seitan: 'Seitan',
  'Sesame seeds': 'Sezamove sjemenke',
  shallots: 'Ljutika',
  'snow peas': 'Snjezni grasak',
  'Sorbet or sorbetto': 'Sorbet',
  Sorbitol: 'Sorbitol',
  soybeans: 'Soja',
  'split peas': 'Polovljeni grasak',
  Stevia: 'Stevija',
  'sugar snap peas': 'Secerni grasak',
  'sun-dried tomatoes': 'Susene rajcice',
  'Sunflower seeds': 'Suncokretove sjemenke',
  'Sweet potato': 'Batat',
  'Swiss chard': 'Blitva',
  Walnuts: 'Orasi',
  Wasabi: 'Wasabi',
  watermelon: 'Lubenica',
  wheat: 'Psenica',
  'white peaches': 'Bijele breskve',
  xylitol: 'Ksilitol',
  'yellow peaches': 'Zute breskve',
  yogurt: 'Jogurt',
};

function normalizeHrText(text: string): string {
  const mojibakeFixed = text
    .replaceAll('\u00C4\u2021', '\u0107')
    .replaceAll('\u00C4\u0164', '\u010D')
    .replaceAll('\u00C4\u2018', '\u0111')
    .replaceAll('\u00C4\u015A', '\u010C')
    .replaceAll('\u0139\u02DD', '\u017D')
    .replaceAll('\u0139\u02C7', '\u0161')
    .replaceAll('\u0139\u00BE', '\u017E')
    .replaceAll('\u0139\u00A0', '\u0160')
    .replaceAll('\u00E2\u20AC\u0153', '"')
    .replaceAll('\u00E2\u20AC\u009D', '"');

  const replacements: Record<string, string> = {
    Orasasti: 'Ora\u0161asti',
    Naranca: 'Naran\u010Da',
    Grozdice: 'Gro\u017E\u0111ice',
    Patlidzan: 'Patlid\u017Ean',
    Zuta: '\u017Duta',
    Spageti: '\u0160pageti',
    Spinat: '\u0160pinat',
    Rajcice: 'Raj\u010Dice',
    Skoljkasi: '\u0160koljka\u0161i',
    odlezani: 'odle\u017Eani',
    svjezi: 'svje\u017Ei',
    americki: 'ameri\u010Dki',
    caj: '\u010Daj',
    djumbir: '\u0111umbir',
    Prasak: 'Pra\u0161ak',
    Cili: '\u010Cili',
    Mjesavina: 'Mje\u0161avina',
    zacina: 'za\u010Dina',
    'Muskatni orascic': 'Mu\u0161katni ora\u0161\u010Di\u0107',
    Persin: 'Per\u0161in',
    Ruzmarin: 'Ru\u017Emarin',
    Safran: '\u0160afran',
    rajcice: 'raj\u010Dice',
    'Majcina dusica': 'Maj\u010Dina du\u0161ica',
    zavrsavaju: 'zavr\u0161avaju',
    Articoke: 'Arti\u010Doke',
    Peceni: 'Pe\u010Deni',
    Jecam: 'Je\u010Dam',
    'Smedi secer': 'Sme\u0111i \u0161e\u0107er',
    Cvjetaca: 'Cvjeta\u010Da',
    Tresnje: 'Tre\u0161nje',
    cokolada: '\u010Dokolada',
    Cesnjak: '\u010Ce\u0161njak',
    cesnjak: '\u010De\u0161njak',
    Grozde: 'Gro\u017E\u0111e',
    vecina: 've\u0107ina',
    ovcje: 'ov\u010Dje',
    Kruske: 'Kru\u0161ke',
    Grasak: 'Gra\u0161ak',
    grasak: 'gra\u0161ak',
    Leca: 'Le\u0107a',
    cisti: '\u010Disti',
    Svjeze: 'Svje\u017Ee',
    sljive: '\u0161ljive',
    Bucine: 'Bu\u010Dine',
    secer: '\u0161e\u0107er',
    Secer: '\u0160e\u0107er',
    Snjezni: 'Snje\u017Eni',
    Susene: 'Su\u0161ene',
    Psenica: 'P\u0161enica',
    Zute: '\u017Dute',
    dorucak: 'doru\u010Dak',
    rize: 'ri\u017Ee',
    Riza: 'Ri\u017Ea',
    Rizini: 'Ri\u017Eini',
    Rizino: 'Ri\u017Eino',
    riza: 'ri\u017Ea',
    rizini: 'ri\u017Eini',
    rizino: 'ri\u017Eino',
    'Kokosov secer': 'Kokosov \u0161e\u0107er',
    brasno: 'bra\u0161no',
    brasna: 'bra\u0161na',
    cips: '\u010Dips',
    Cips: '\u010Cips',
    obicni: 'obi\u010Dni',
    obicne: 'obi\u010Dne',
    zitarice: '\u017Eitarice',
  };

  return Object.entries(replacements).reduce((acc, [from, to]) => acc.replaceAll(from, to), mojibakeFixed);
}

function foldSearchText(text: string): string {
  const normalized = normalizeHrText(text).toLowerCase();
  const withoutCombining = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return withoutCombining
    .replaceAll('\u0111', 'd')
    .replaceAll('\u017E', 'z')
    .replaceAll('\u0161', 's')
    .replaceAll('\u010D', 'c')
    .replaceAll('\u0107', 'c');
}

function localizeFoodName(food: FoodItem, isHr: boolean): string {
  if (!isHr) return food.name;
  return normalizeHrText(HR_FOOD_NAME_MAP[food.name] ?? food.name);
}

function localizeFoodCategory(food: FoodItem, isHr: boolean): string {
  if (!isHr) return food.category;
  return normalizeHrText(HR_FOOD_CATEGORY_MAP[food.category] ?? food.category);
}

export default function FoodHub() {
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const [activeTab, setActiveTab] = useState<'database' | 'log'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLow, setFilterLow] = useState(true);
  const [filterCaution, setFilterCaution] = useState(true);
  const [filterHigh, setFilterHigh] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', amount: '', status: 'safe' as const, notes: '' });
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const copy = {
    title: isHr ? 'Prehrana' : 'Food Hub',
    subtitle: isHr
      ? 'Low FODMAP prehrana privremeno smanjuje fermentabilne ugljikohidrate kako bi se prepoznali triggeri i smanjile tegobe. Koristi bazu u eliminacijskoj fazi, pa zatim uvodi hranu jednu po jednu.'
      : 'A low FODMAP diet temporarily reduces certain fermentable carbohydrates to help identify symptom triggers and manage digestive discomfort. Use this database during your elimination phase, then gradually reintroduce foods one by one.',
    tabDatabase: isHr ? 'Low FODMAP baza' : 'Low FODMAP Database',
    tabLog: isHr ? 'Osobni dnevnik hrane' : 'Personal Food Log',
    searchFoods: isHr ? 'Pretraži namirnice...' : 'Search foods...',
    searchLog: isHr ? 'Pretraži dnevnik...' : 'Search your log...',
    filters: isHr ? 'Filteri' : 'Filters',
    level: isHr ? 'FODMAP razina' : 'FODMAP Level',
    lowSafe: isHr ? 'Nisko (sigurno)' : 'Low (safe)',
    cautionPortion: isHr ? 'Oprez / porcija' : 'Caution / Portion',
    high: isHr ? 'Visoko' : 'High',
    noFoods: isHr ? 'Nema namirnica za odabrane filtere.' : 'No foods found matching your filters.',
    addFood: isHr ? 'Dodaj hranu' : 'Add Food',
    noLogs: isHr ? 'Još nema unosa hrane. Dodaj prvi unos.' : 'No foods logged yet. Add your first food.',
    amount: isHr ? 'Količina' : 'Amount',
    limitTo: isHr ? 'Limit' : 'Limit to',
    modalTitle: isHr ? 'Dodaj osobni unos hrane' : 'Log Personal Food',
    foodName: isHr ? 'Naziv hrane *' : 'Food Name *',
    amountReq: isHr ? 'Količina *' : 'Amount *',
    reactionStatus: isHr ? 'Status reakcije *' : 'Reaction Status *',
    notes: isHr ? 'Bilješke (opcionalno)' : 'Notes (Optional)',
    cancel: isHr ? 'Odustani' : 'Cancel',
    saveFood: isHr ? 'Spremi hranu' : 'Save Food',
    safeGreen: isHr ? 'Sigurno (zeleno)' : 'Safe (Green)',
    cautionOrange: isHr ? 'Oprez (narančasto)' : 'Caution (Orange)',
    triggerRed: isHr ? 'Trigger (crveno)' : 'Trigger (Red)',
    deleteTitle: isHr ? 'Obrisati ovaj unos hrane?' : 'Delete this food log?',
    deleteTextA: isHr ? 'Ova radnja se ne može poništiti. Brišeš' : 'This action cannot be undone. You are deleting',
    deleteTextB: isHr ? 'iz osobnog dnevnika.' : 'from your personal log.',
    deleteFood: isHr ? 'Obriši hranu' : 'Delete Food',
    lowFodmap: isHr ? 'Niski FODMAP' : 'Low FODMAP',
    highFodmap: isHr ? 'Visoki FODMAP' : 'High FODMAP',
    safe: isHr ? 'Sigurno' : 'Safe',
    caution: isHr ? 'Oprez' : 'Caution',
    trigger: 'Trigger',
  };

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`sibolytics_foodlog_${user.id}`);
      if (stored) {
        setLoggedFoods(JSON.parse(stored));
      }
    }
  }, [user]);

  const saveLoggedFoods = (newFoods: LoggedFood[]) => {
    setLoggedFoods(newFoods);
    if (user) {
      localStorage.setItem(`sibolytics_foodlog_${user.id}`, JSON.stringify(newFoods));
    }
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    const food: LoggedFood = {
      ...newFood,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveLoggedFoods([food, ...loggedFoods]);
    setIsAddingFood(false);
    setNewFood({ name: '', amount: '', status: 'safe', notes: '' });
  };

  const handleDeleteFood = (id: string) => {
    setDeleteCandidateId(id);
  };

  const confirmDeleteFood = () => {
    if (!deleteCandidateId) return;
    saveLoggedFoods(loggedFoods.filter((f) => f.id !== deleteCandidateId));
    setDeleteCandidateId(null);
  };

  const foldedQuery = foldSearchText(searchQuery);

  const filteredDatabase = foods.filter((food) => {
    const localizedName = localizeFoodName(food, isHr);
    const localizedCategory = localizeFoodCategory(food, isHr);
    const matchesSearch = [
      food.name,
      localizedName,
      food.category,
      localizedCategory,
    ].some((value) => foldSearchText(value).includes(foldedQuery));

    let matchesFilter = false;
    if (food.fodmapLevel === 'low' && filterLow) matchesFilter = true;
    if (food.fodmapLevel === 'caution' && filterCaution) matchesFilter = true;
    if (food.fodmapLevel === 'high' && filterHigh) matchesFilter = true;

    if (!filterLow && !filterCaution && !filterHigh) return false;
    return matchesSearch && matchesFilter;
  });

  const filteredLog = loggedFoods.filter((food) => {
    const foldedName = foldSearchText(food.name);
    const foldedNotes = foldSearchText(food.notes ?? '');
    return foldedName.includes(foldedQuery) || foldedNotes.includes(foldedQuery);
  });

  const deleteCandidate = loggedFoods.find((food) => food.id === deleteCandidateId);

  const getBadgeConfig = (level: FoodItem['fodmapLevel']) => {
    switch (level) {
      case 'low':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          label: copy.lowFodmap,
        };
      case 'caution':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          label: copy.cautionPortion,
        };
      case 'high':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: copy.highFodmap,
        };
    }
  };

  const getLogBadgeConfig = (status: LoggedFood['status']) => {
    switch (status) {
      case 'safe':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: copy.safe };
      case 'caution':
        return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: copy.caution };
      case 'trigger':
        return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: copy.trigger };
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">{copy.title}</h1>
        <p className="text-slate-400 max-w-3xl">{copy.subtitle}</p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'database' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {copy.tabDatabase}
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'log' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {copy.tabLog}
          </button>
        </div>

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={activeTab === 'database' ? copy.searchFoods : copy.searchLog}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {activeTab === 'database' ? (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <button
            className="lg:hidden w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-medium"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {copy.filters}
          </button>

          <div className={`lg:w-64 shrink-0 lg:sticky lg:top-32 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-4">
                {copy.level}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filterLow ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                    {filterLow && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filterLow} onChange={() => setFilterLow(!filterLow)} />
                  <span className="text-sm text-slate-300">{copy.lowSafe}</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filterCaution ? 'bg-amber-500 border-amber-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                    {filterCaution && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filterCaution} onChange={() => setFilterCaution(!filterCaution)} />
                  <span className="text-sm text-slate-300">{copy.cautionPortion}</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filterHigh ? 'bg-red-500 border-red-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                    {filterHigh && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filterHigh} onChange={() => setFilterHigh(!filterHigh)} />
                  <span className="text-sm text-slate-300">{copy.high}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDatabase.map((food) => {
                const badge = getBadgeConfig(food.fodmapLevel);
                const localizedName = localizeFoodName(food, isHr);
                const localizedCategory = localizeFoodCategory(food, isHr);
                return (
                  <div key={food.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm hover:bg-slate-900/60 transition-colors flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">{localizedName}</h3>
                        <p className="text-xs text-slate-500">{localizedCategory}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                        {badge.icon}
                        {badge.label}
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      {food.limitText && (
                        <div className={`text-sm font-medium ${food.fodmapLevel === 'low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {copy.limitTo}: {food.limitText}
                        </div>
                      )}

                      {food.note && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400 leading-relaxed">
                          {food.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDatabase.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">{copy.noFoods}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddingFood(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> {copy.addFood}
            </button>
          </div>

          {filteredLog.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400">{copy.noLogs}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLog.map((food) => {
                const badge = getLogBadgeConfig(food.status);
                return (
                  <div key={food.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">{food.name}</h3>
                        <p className="text-xs text-slate-500">{new Date(food.createdAt).toLocaleDateString(isHr ? 'hr-HR' : 'en-US')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-md border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                          {badge.label}
                        </div>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{copy.amount}:</span>
                        <span className="text-slate-200 font-medium">{food.amount}</span>
                      </div>
                      {food.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400 leading-relaxed">
                          {food.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {isAddingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-medium text-white">{copy.modalTitle}</h2>
            </div>
            <form onSubmit={handleAddFood} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.foodName}</label>
                <input
                  type="text"
                  required
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder={isHr ? 'npr. Avokado' : 'e.g., Avocado'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.amountReq}</label>
                <input
                  type="text"
                  required
                  value={newFood.amount}
                  onChange={(e) => setNewFood({ ...newFood, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder={isHr ? 'npr. 1/4 komada, 20g' : 'e.g., 1/4 whole, 20g'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.reactionStatus}</label>
                <select
                  value={newFood.status}
                  onChange={(e) => setNewFood({ ...newFood, status: e.target.value as 'safe' | 'caution' | 'trigger' })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="safe">{copy.safeGreen}</option>
                  <option value="caution">{copy.cautionOrange}</option>
                  <option value="trigger">{copy.triggerRed}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.notes}</label>
                <textarea
                  value={newFood.notes}
                  onChange={(e) => setNewFood({ ...newFood, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                  placeholder={isHr ? 'npr. Nadutost 2 sata kasnije' : 'e.g., Felt bloated 2 hours later'}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingFood(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {copy.saveFood}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{copy.deleteTitle}</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {copy.deleteTextA}{' '}
                  <span className="text-slate-200">{deleteCandidate.name}</span>{' '}
                  {copy.deleteTextB}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copy.cancel}
              </button>
              <button
                onClick={confirmDeleteFood}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                {copy.deleteFood}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export interface FoodItem {
  id: string;
  name: string;
  category: string;
  fodmapLevel: 'low' | 'caution' | 'high';
  limitText?: string;
  note?: string;
  sourceTag: string;
}

export const foods: FoodItem[] = [
  {
    "id": "garlic",
    "name": "Garlic",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "avoid entirely (source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "onions",
    "name": "Onions",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "avoid entirely (source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "artichoke-including-jerusalem-artichoke",
    "name": "Artichoke, including Jerusalem artichoke",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "asparagus",
    "name": "Asparagus",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "baked-beans",
    "name": "Baked beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "beetroot-fresh",
    "name": "Beetroot, fresh",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "black-eyed-peas",
    "name": "Black eyed peas",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "broad-beans",
    "name": "Broad beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "butter-beans",
    "name": "Butter beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cassava",
    "name": "Cassava",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cauliflower-over-75g",
    "name": "Cauliflower, over 75g",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "caution",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "celery",
    "name": "Celery",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "caution",
    "limitText": "5cm of stalk",
    "note": "over 5cm of stalk becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "choko",
    "name": "Choko",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "falafel",
    "name": "Falafel",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "haricot-beans",
    "name": "Haricot beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kidney-beans",
    "name": "Kidney beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kelp-kombu",
    "name": "Kelp / Kombu",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lima-beans",
    "name": "Lima beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "leek-bulb",
    "name": "Leek bulb",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mange-tout",
    "name": "Mange Tout",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mixed-vegetables",
    "name": "Mixed vegetables",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mung-beans",
    "name": "Mung beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mushrooms",
    "name": "Mushrooms",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peas-sugar-snap",
    "name": "Peas, sugar snap",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pickled-vegetables",
    "name": "Pickled vegetables",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "red-kidney-beans",
    "name": "Red kidney beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "caution",
    "limitText": "85g",
    "note": "over 85g becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "savoy-cabbage",
    "name": "Savoy Cabbage",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "caution",
    "limitText": "1/2 cup",
    "note": "over 1/2 cup becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soy-beans-soya-beans",
    "name": "Soy beans / soya beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "split-peas",
    "name": "Split peas",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "scallions-spring-onions-bulb-white-part",
    "name": "Scallions / spring onions (bulb / white part)",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "shallots",
    "name": "Shallots",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "taro",
    "name": "Taro",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "apples-including-pink-lady-and-granny-smith",
    "name": "Apples including pink lady and granny smith",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "apricots",
    "name": "Apricots",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "avocado-over-1-2-cup",
    "name": "Avocado, over 1/2 cup",
    "category": "Fruit",
    "fodmapLevel": "caution",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bananas-ripe",
    "name": "Bananas, ripe",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "blackberries",
    "name": "Blackberries",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "blackcurrants",
    "name": "Blackcurrants",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "boysenberry",
    "name": "Boysenberry",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cherries",
    "name": "Cherries",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "currants",
    "name": "Currants",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "custard-apple",
    "name": "Custard apple",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "feijoa",
    "name": "Feijoa",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "figs",
    "name": "Figs",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "goji-berries",
    "name": "Goji berries",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "grapefruit",
    "name": "Grapefruit",
    "category": "Fruit",
    "fodmapLevel": "caution",
    "limitText": "80g",
    "note": "over 80g becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "guava-unripe",
    "name": "Guava, unripe",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "juniper-berry-dried",
    "name": "Juniper Berry, dried",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lychee",
    "name": "Lychee",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mango",
    "name": "Mango",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "nectarines",
    "name": "Nectarines",
    "category": "Fruit",
    "fodmapLevel": "caution",
    "limitText": "1/2 a nectarine",
    "note": "over 1/2 a nectarine becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "paw-paw-dried",
    "name": "Paw paw, dried",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peaches",
    "name": "Peaches",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pears",
    "name": "Pears",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "persimmon",
    "name": "Persimmon",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pineapple-dried",
    "name": "Pineapple, dried",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "plums",
    "name": "Plums",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pomegranate",
    "name": "Pomegranate",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "prunes",
    "name": "Prunes",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "raisins",
    "name": "Raisins",
    "category": "Fruit",
    "fodmapLevel": "caution",
    "limitText": "1 tbsp / 13g",
    "note": "over 1 tbsp / 13g becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sea-buckthorns",
    "name": "Sea buckthorns",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sultanas",
    "name": "Sultanas",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tamarillo",
    "name": "Tamarillo",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tinned-fruit-in-apple-pear-juice",
    "name": "Tinned fruit in apple / pear juice",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "watermelon",
    "name": "Watermelon",
    "category": "Fruit",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chorizo-if-garlic-added",
    "name": "Chorizo if garlic added",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sausages",
    "name": "Sausages",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "high",
    "note": "check ingredients",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuits-cookies-including-chocolate-chip-cookies",
    "name": "Biscuits / cookies including chocolate chip cookies",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bread-wheat",
    "name": "Bread, wheat",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "caution",
    "limitText": "1 slice",
    "note": "over 1 slice becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "breadcrumbs",
    "name": "Breadcrumbs",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cakes",
    "name": "Cakes",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cereal-bar-wheat-based",
    "name": "Cereal bar, wheat based",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "croissants",
    "name": "Croissants",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "crumpets",
    "name": "Crumpets",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "egg-noodles",
    "name": "Egg noodles",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "muffins",
    "name": "Muffins",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pasta-wheat-over-1-2-cup-cooked",
    "name": "Pasta, wheat over 1/2 cup cooked",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "caution",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "udon-noodles",
    "name": "Udon noodles",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-bran",
    "name": "Wheat bran",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-cereals",
    "name": "Wheat cereals",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-flour",
    "name": "Wheat flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-germ",
    "name": "Wheat germ",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-noodles",
    "name": "Wheat noodles",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-rolls",
    "name": "Wheat rolls",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "almond-meal",
    "name": "Almond meal",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "amaranth-flour",
    "name": "Amaranth flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "barley-including-flour",
    "name": "Barley including flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bran-cereals",
    "name": "Bran cereals",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "granary-bread",
    "name": "Granary bread",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "multigrain-bread",
    "name": "Multigrain bread",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "naan",
    "name": "Naan",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oatmeal-bread",
    "name": "Oatmeal bread",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pumpernickel-bread",
    "name": "Pumpernickel bread",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "roti",
    "name": "Roti",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sourdough-with-kamut",
    "name": "Sourdough with kamut",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cashews",
    "name": "Cashews",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chestnut-flour",
    "name": "Chestnut flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cous-cous",
    "name": "Cous cous",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "einkorn-flour",
    "name": "Einkorn flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "freekeh",
    "name": "Freekeh",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gnocchi",
    "name": "Gnocchi",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "granola-bar",
    "name": "Granola bar",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "muesli-cereal",
    "name": "Muesli cereal",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "muesli-bar",
    "name": "Muesli bar",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pistachios",
    "name": "Pistachios",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rye",
    "name": "Rye",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rye-crispbread",
    "name": "Rye crispbread",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "semolina",
    "name": "Semolina",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "spelt-flour",
    "name": "Spelt flour",
    "category": "Cereals, Grains, Breads, Biscuits/Cookies, Pasta, Nuts and Cakes",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "agave",
    "name": "Agave",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "caviar-dip",
    "name": "Caviar dip",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fructose",
    "name": "Fructose",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-bar",
    "name": "Fruit bar",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gravy-if-it-contains-onion",
    "name": "Gravy, if it contains onion",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "high-fructose-corn-syrup-hfcs",
    "name": "High fructose corn syrup (HFCS)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "hummus-houmous",
    "name": "Hummus / houmous",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "honey",
    "name": "Honey",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "jam-mixed-berries",
    "name": "Jam, mixed berries",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "jam-strawberry-if-contains-hfcs",
    "name": "Jam, strawberry, if contains HFCS",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "molasses",
    "name": "Molasses",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pesto-sauce",
    "name": "Pesto sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "quince-paste",
    "name": "Quince paste",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "relish-vegetable-pickle",
    "name": "Relish / vegetable pickle",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "stock-cubes",
    "name": "Stock cubes",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sugar-free-sweets-containing-polyols",
    "name": "Sugar free sweets containing polyols",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "usually ending in -ol or isomalt",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "inulin",
    "name": "Inulin",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "isomalt-e953-953",
    "name": "Isomalt (E953 / 953)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lactitol-e966-966",
    "name": "Lactitol (E966 / 966)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "maltitol-e965-965",
    "name": "Maltitol (E965 / 965)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mannitol-e241-421",
    "name": "Mannitol (E241 / 421)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sorbitol-e420-420",
    "name": "Sorbitol (E420 / 420)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "xylitol-e967-967",
    "name": "Xylitol (E967 / 967)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tzatziki-dip",
    "name": "Tzatziki dip",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wasabi",
    "name": "Wasabi",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fos",
    "name": "FOS",
    "category": "Prebiotic Foods",
    "fodmapLevel": "high",
    "note": "fructooligosaccharides",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oligofructose",
    "name": "Oligofructose",
    "category": "Prebiotic Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "beer",
    "name": "Beer",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "if drinking more than one bottle",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cordial-apple-and-raspberry-with-50",
    "name": "Cordial, apple and raspberry with 50",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "100% real juice",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cordial-orange-with-25",
    "name": "Cordial, orange with 25",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "50% real juice",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-and-herbal-teas-with-apple-added",
    "name": "Fruit and herbal teas with apple added",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-juices-in-large-quantities",
    "name": "Fruit juices in large quantities",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-juices-made-of-apple-pear-mango",
    "name": "Fruit juices made of apple, pear, mango",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kombucha",
    "name": "Kombucha",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "malted-chocolate-flavored-drink",
    "name": "Malted chocolate flavored drink",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "meal-replacement-drinks-containing-milk-based-products-e-g-ensure-slim-fast",
    "name": "Meal replacement drinks containing milk based products e.g. Ensure, Slim Fast",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "orange-juice-in-quantities-over-100ml",
    "name": "Orange juice in quantities over 100ml",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "caution",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "quinoa-milk",
    "name": "Quinoa milk",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rum",
    "name": "Rum",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sodas-containing-high-fructose-corn-syrup-hfcs",
    "name": "Sodas containing High Fructose Corn Syrup (HFCS)",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soy-milk-made-with-soy-beans",
    "name": "Soy milk made with soy beans",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "commonly found in USA",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sports-drinks",
    "name": "Sports drinks",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "black-tea-with-added-soy-milk",
    "name": "Black tea with added soy milk",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chai-tea-strong",
    "name": "Chai tea, strong",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dandelion-tea-strong",
    "name": "Dandelion tea, strong",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fennel-tea",
    "name": "Fennel tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chamomile-tea",
    "name": "Chamomile tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "herbal-tea-strong",
    "name": "Herbal tea, strong",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oolong-tea",
    "name": "Oolong tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wine",
    "name": "Wine",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "if drinking more than one glass",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "whey-protein-concentrate-unless-lactose-free",
    "name": "Whey protein, concentrate unless lactose free",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "whey-protein-hydrolyzed-unless-lactose-free",
    "name": "Whey protein, hydrolyzed unless lactose free",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "buttermilk",
    "name": "Buttermilk",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cheese-ricotta",
    "name": "Cheese, ricotta",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cream",
    "name": "Cream",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "custard",
    "name": "Custard",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gelato",
    "name": "Gelato",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ice-cream",
    "name": "Ice cream",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kefir",
    "name": "Kefir",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cow-milk",
    "name": "Cow milk",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "goat-milk",
    "name": "Goat milk",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "evaporated-milk",
    "name": "Evaporated milk",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sheep-s-milk",
    "name": "Sheep's milk",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sour-cream",
    "name": "Sour cream",
    "category": "Dairy Foods",
    "fodmapLevel": "caution",
    "limitText": "2tbsp",
    "note": "over 2tbsp becomes high FODMAP (source wording)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "yoghurt",
    "name": "Yoghurt",
    "category": "Dairy Foods",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "carob-powder-carob-flour",
    "name": "Carob powder / carob flour",
    "category": "Cooking ingredients",
    "fodmapLevel": "high",
    "note": "listed as high in source",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "alfalfa",
    "name": "Alfalfa",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bamboo-shoots",
    "name": "Bamboo shoots",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bean-sprouts",
    "name": "Bean sprouts",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "beetroot-canned-and-pickled",
    "name": "Beetroot, canned and pickled",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "black-beans",
    "name": "Black beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup / 45g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bok-choy-pak-choi",
    "name": "Bok choy / pak choi",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "broccoli-heads-only",
    "name": "Broccoli, heads only",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "3/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "broccoli-stalks-only",
    "name": "Broccoli, stalks only",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/3 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "broccolini-heads-only",
    "name": "Broccolini, heads only",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "broccolini-stalks-only",
    "name": "Broccolini, stalks only",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "3/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "brussels-sprouts",
    "name": "Brussels sprouts",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "2 sprouts",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "butternut-squash",
    "name": "Butternut squash",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cabbage-common-and-red-up-to-3-4-cup",
    "name": "Cabbage, common and red up to 3/4 cup",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "callaloo",
    "name": "Callaloo",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "carrots",
    "name": "Carrots",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "celeriac",
    "name": "Celeriac",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chicory-leaves",
    "name": "Chicory leaves",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chick-peas",
    "name": "Chick peas",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chilli",
    "name": "Chilli",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "if tolerable",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chinese-cabbage-wombok",
    "name": "Chinese cabbage / wombok",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chives",
    "name": "Chives",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cho-cho",
    "name": "Cho cho",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/2 cup diced",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "choy-sum",
    "name": "Choy sum",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "collard-greens",
    "name": "Collard greens",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corn-sweet-corn",
    "name": "Corn / sweet corn",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "if tolerable and only in small amounts - 1/2 cob",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "courgette",
    "name": "Courgette",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "65g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cucumber",
    "name": "Cucumber",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "eggplant-aubergine-1-cup",
    "name": "Eggplant / aubergine (1 cup)",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fennel-bulb",
    "name": "Fennel, bulb",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 75g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fennel-leaves",
    "name": "Fennel, leaves",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 15g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fermented-cabbage-e-g-sauerkraut",
    "name": "Fermented cabbage e.g. sauerkraut",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 1/2 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "green-beans",
    "name": "Green beans",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "green-pepper-green-bell-pepper-green-capsicum",
    "name": "Green pepper / green bell pepper / green capsicum",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/2 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ginger",
    "name": "Ginger",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kale",
    "name": "Kale",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "karela",
    "name": "Karela",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kumara-sweet-potato-purple-and-white",
    "name": "Kumara, sweet potato, purple and white",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 75g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "leek-leaves",
    "name": "Leek leaves",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lentils",
    "name": "Lentils",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "in small amounts",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "butter-lettuce",
    "name": "Butter lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "iceberg-lettuce",
    "name": "Iceberg lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "radicchio-lettuce",
    "name": "Radicchio lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "red-coral-lettuce",
    "name": "Red coral lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rocket-lettuce",
    "name": "Rocket lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "romaine-cos-lettuce",
    "name": "Romaine/Cos lettuce",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "marrow",
    "name": "Marrow",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "okra",
    "name": "Okra",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "olives",
    "name": "Olives",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "parsnip",
    "name": "Parsnip",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peas-snow",
    "name": "Peas, snow",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "5 pods",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pickled-gherkins",
    "name": "Pickled gherkins",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pickled-onions-large",
    "name": "Pickled onions, large",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "potato",
    "name": "Potato",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pumpkin",
    "name": "Pumpkin",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 63g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pumpkin-canned",
    "name": "Pumpkin, canned",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup, 2.2 oz",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "radish",
    "name": "Radish",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "red-peppers-red-bell-pepper-red-capsicum",
    "name": "Red peppers / red bell pepper / red capsicum",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "scallions-spring-onions-green-part",
    "name": "Scallions / spring onions (green part)",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "seaweed-nori",
    "name": "Seaweed / nori",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "silverbeet-chard",
    "name": "Silverbeet / chard",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "spaghetti-squash",
    "name": "Spaghetti squash",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "spinach-baby",
    "name": "Spinach, baby",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "spinach-english",
    "name": "Spinach, english",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "squash",
    "name": "Squash",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 63g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sun",
    "name": "Sun",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "dried tomatoes - 4 pieces",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "swede",
    "name": "Swede",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "swiss-chard",
    "name": "Swiss chard",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sweet-potato",
    "name": "Sweet potato",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/2 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato",
    "name": "Tomato",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "canned, cherry, common, roma",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-canned",
    "name": "Tomato, canned",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "3/5 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-common",
    "name": "Tomato, common",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "up to 65g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-cherry",
    "name": "Tomato, cherry",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "5 cherries",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-juice",
    "name": "Tomato juice",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/2 glass",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-paste-concentrate",
    "name": "Tomato paste / concentrate",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "2 tablespoons",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomatillo-fresh",
    "name": "Tomatillo, fresh",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomatillos-canned",
    "name": "Tomatillos, canned",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "75g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "turnip",
    "name": "Turnip",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "1/2 turnip",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "water-chestnuts",
    "name": "Water chestnuts",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "water-spinach",
    "name": "Water Spinach",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "yam",
    "name": "Yam",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "zucchini",
    "name": "Zucchini",
    "category": "Vegetables and Legumes",
    "fodmapLevel": "low",
    "limitText": "65g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ackee",
    "name": "Ackee",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "applesauce",
    "name": "Applesauce",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "3/4 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bananas-unripe",
    "name": "Bananas, unripe",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1 medium",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bilberries",
    "name": "Bilberries",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "blueberries",
    "name": "Blueberries",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "breadfruit",
    "name": "Breadfruit",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "carambola",
    "name": "Carambola",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cantaloupe",
    "name": "Cantaloupe",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "3/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cranberry",
    "name": "Cranberry",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "clementine",
    "name": "Clementine",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-cream",
    "name": "Coconut, cream",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1/4 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-flesh",
    "name": "Coconut, flesh",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "2/3 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-sugar",
    "name": "Coconut, sugar",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cranberry-juice",
    "name": "Cranberry juice",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "3/4 glass",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dates",
    "name": "Dates",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "up to 5",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dragon-fruit",
    "name": "Dragon fruit",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lingonberries",
    "name": "Lingonberries",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "grapes-red-and-white",
    "name": "Grapes, red and white",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "10g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "guava-ripe",
    "name": "Guava, ripe",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "honeydew-and-galia-melons",
    "name": "Honeydew and Galia melons",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1/2 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "jackfruit",
    "name": "Jackfruit",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1/3 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kiwifruit",
    "name": "Kiwifruit",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "2 small",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lemon-including-lemon-juice",
    "name": "Lemon including lemon juice",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lime-including-lime-juice",
    "name": "Lime including lime juice",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mandarin",
    "name": "Mandarin",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "orange",
    "name": "Orange",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "passion-fruit",
    "name": "Passion fruit",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "paw-paw",
    "name": "Paw paw",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "papaya",
    "name": "Papaya",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pineapple",
    "name": "Pineapple",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "plantain-peeled",
    "name": "Plantain, peeled",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "prickly-pear-nopales",
    "name": "Prickly pear / nopales",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "raspberry",
    "name": "Raspberry",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "1/3 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rhubarb",
    "name": "Rhubarb",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "strawberry",
    "name": "Strawberry",
    "category": "Fruit",
    "fodmapLevel": "low",
    "limitText": "65g / about 5 medium strawberries",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tamarind",
    "name": "Tamarind",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tangelo",
    "name": "Tangelo",
    "category": "Fruit",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "beef",
    "name": "Beef",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chicken",
    "name": "Chicken",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chorizo",
    "name": "Chorizo",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "foie-gras",
    "name": "Foie gras",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kangaroo",
    "name": "Kangaroo",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lamb",
    "name": "Lamb",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pork",
    "name": "Pork",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "prosciutto",
    "name": "Prosciutto",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "quorn-mince",
    "name": "Quorn, mince",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "turkey",
    "name": "Turkey",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cold-cuts-deli-meat-cold-meats-such-as-ham-and-turkey-breast",
    "name": "Cold cuts / deli meat / cold meats such as ham and turkey breast",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "processed-meat",
    "name": "Processed meat",
    "category": "Meats, Poultry and Meat Substitutes",
    "fodmapLevel": "low",
    "limitText": "check ingredients",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "canned-tuna",
    "name": "Canned tuna",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fresh-fish-e-g",
    "name": "Fresh fish e.g.",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cod",
    "name": "Cod",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "haddock",
    "name": "Haddock",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "plaice",
    "name": "Plaice",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "salmon",
    "name": "Salmon",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "trout",
    "name": "Trout",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tuna",
    "name": "Tuna",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "seafood-ensuring-nothing-else-is-added-e-g",
    "name": "Seafood (ensuring nothing else is added) e.g.",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "crab",
    "name": "Crab",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lobster",
    "name": "Lobster",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mussels",
    "name": "Mussels",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oysters",
    "name": "Oysters",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "prawns",
    "name": "Prawns",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "shrimp",
    "name": "Shrimp",
    "category": "Fish and Seafood",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-free-breads",
    "name": "Wheat free breads",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gluten-free-breads",
    "name": "Gluten free breads",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corn-bread",
    "name": "Corn bread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-bread",
    "name": "Rice bread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "spelt-sourdough-bread",
    "name": "Spelt sourdough bread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "potato-flour-bread",
    "name": "Potato flour bread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wheat-free-or-gluten-free-pasta",
    "name": "Wheat free or gluten free pasta",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "almonds",
    "name": "Almonds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "10 almonds",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-cream-cracker",
    "name": "Biscuit, cream cracker",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "4 crackers",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-oatcakes",
    "name": "Biscuit, oatcakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "4 cakes",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-savory",
    "name": "Biscuit, savory",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "2 biscuits",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-shortbread",
    "name": "Biscuit, shortbread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "1 biscuit",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-sweet-plain",
    "name": "Biscuit, sweet, plain",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "2 biscuits",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "biscuit-wholegrain-oat-cereal-biscuit",
    "name": "Biscuit, wholegrain oat cereal biscuit",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "2 biscuits",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "brazil-nuts",
    "name": "Brazil nuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 10 nuts",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bulgur-bourghal",
    "name": "Bulgur / bourghal",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "1/4 cup cooked, 44g serving",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "buckwheat",
    "name": "Buckwheat",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "buckwheat-flour",
    "name": "Buckwheat flour",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "buckwheat-noodles",
    "name": "Buckwheat noodles",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "brown-rice-whole-grain-rice",
    "name": "Brown rice / whole grain rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cassava-flour",
    "name": "Cassava flour",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chestnuts",
    "name": "Chestnuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chips-plain-potato-crisps-plain",
    "name": "Chips, plain / potato crisps, plain",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cornflour-maize",
    "name": "Cornflour / maize",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "crispbread",
    "name": "Crispbread",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corncakes",
    "name": "Corncakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cornflakes",
    "name": "Cornflakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "1/2 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cornflakes-gluten-free",
    "name": "Cornflakes, gluten free",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corn-creamed-and-canned-up-to-1-3-cup",
    "name": "Corn, creamed and canned (up to 1/3 cup)",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corn-tortillas-3-tortillas",
    "name": "Corn tortillas, 3 tortillas",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "crackers-plain",
    "name": "Crackers, plain",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "flax-seeds-linseeds",
    "name": "Flax seeds / linseeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 1 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "flaxseed-oil",
    "name": "Flaxseed Oil",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "hazelnuts",
    "name": "Hazelnuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "24 hazelnuts",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "corn-flakes",
    "name": "Corn Flakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "crispix",
    "name": "Crispix",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "frosted-flakes",
    "name": "Frosted Flakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "frosted-krispies",
    "name": "Frosted Krispies",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-krispies",
    "name": "Rice Krispies",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "macadamia-nuts",
    "name": "Macadamia nuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 15 nuts",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "millet",
    "name": "Millet",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mixed-nuts",
    "name": "Mixed nuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oatmeal-1-2-cup",
    "name": "Oatmeal, 1/2 cup",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oats",
    "name": "Oats",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oatcakes",
    "name": "Oatcakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pastry-filo-phyllo",
    "name": "Pastry, filo / phyllo",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "1 sheet",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pastry-puff",
    "name": "Pastry, puff",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "1/4 sheet",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peanuts",
    "name": "Peanuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pecans",
    "name": "Pecans",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "15 halves",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pine-nuts",
    "name": "Pine nuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "polenta",
    "name": "Polenta",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "popcorn",
    "name": "Popcorn",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "porridge-and-oat-based-cereals",
    "name": "Porridge and oat based cereals",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "potato-flour",
    "name": "Potato flour",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pretzels",
    "name": "Pretzels",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "quinoa",
    "name": "Quinoa",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pasta-wheat",
    "name": "Pasta, wheat",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 1/2 cup cooked",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "basmati-rice",
    "name": "Basmati rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bomba-rice",
    "name": "Bomba rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "brown-rice",
    "name": "Brown rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-noodles",
    "name": "Rice noodles",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "white-rice",
    "name": "White rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "wild-rice",
    "name": "Wild rice",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 1 cup",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-bran",
    "name": "Rice bran",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-cakes",
    "name": "Rice cakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-crackers",
    "name": "Rice crackers",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-flakes",
    "name": "Rice flakes",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-flour",
    "name": "Rice flour",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chia-seeds",
    "name": "Chia seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dill-seeds",
    "name": "Dill seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "egusi-seeds",
    "name": "Egusi seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "hemp-seeds",
    "name": "Hemp seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "poppy-seeds",
    "name": "Poppy seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pumpkin-seeds",
    "name": "Pumpkin seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sesame-seeds",
    "name": "Sesame seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sunflower-seeds",
    "name": "Sunflower seeds",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "starch-maize-potato-and-tapioca",
    "name": "Starch, maize, potato and tapioca",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sorghum",
    "name": "Sorghum",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tortilla-chips-corn-chips",
    "name": "Tortilla chips / corn chips",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "walnuts",
    "name": "Walnuts",
    "category": "Cereals, Grains, Breads, Biscuits, Pasta, Nuts and Cakes",
    "fodmapLevel": "low",
    "limitText": "up to 15 nut halves",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "aspartame",
    "name": "Aspartame",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "acesulfame-k",
    "name": "Acesulfame K",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "almond-butter",
    "name": "Almond butter",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "barbecue-sauce",
    "name": "Barbecue sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "check label carefully",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "capers-in-vinegar",
    "name": "Capers in vinegar",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "capers-salted",
    "name": "Capers, salted",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dark-chocolate",
    "name": "Dark chocolate",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "5 squares",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "milk-chocolate",
    "name": "Milk chocolate",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "4 squares",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "white-chocolate",
    "name": "White chocolate",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "3 squares",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chutney-1-tablespoon",
    "name": "Chutney, 1 tablespoon",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dijon-mustard",
    "name": "Dijon mustard",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "erythritol-e968-968",
    "name": "Erythritol (E968 / 968)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fish-sauce",
    "name": "Fish sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "golden-syrup",
    "name": "Golden syrup",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "glucose",
    "name": "Glucose",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "glycerol-e422-422",
    "name": "Glycerol (E422 / 422)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "jam-jelly-strawberry",
    "name": "Jam / jelly, strawberry",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "jam-jelly-raspberry",
    "name": "Jam / jelly, raspberry",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "2 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ketchup-usa",
    "name": "Ketchup (USA)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "1 sachet",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "maple-syrup",
    "name": "Maple syrup",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "marmalade",
    "name": "Marmalade",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "marmite",
    "name": "Marmite",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mayonnaise",
    "name": "Mayonnaise",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "ensuring no garlic or onion in ingredients",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "miso-paste",
    "name": "Miso paste",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mustard",
    "name": "Mustard",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oyster-sauce",
    "name": "Oyster sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peanut-butter",
    "name": "Peanut butter",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-malt-syrup",
    "name": "Rice malt syrup",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "saccharine",
    "name": "Saccharine",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "shrimp-paste",
    "name": "Shrimp paste",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soy-sauce",
    "name": "Soy sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sriracha-hot-chilli-sauce",
    "name": "Sriracha hot chilli sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "stevia",
    "name": "Stevia",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sweet-and-sour-sauce",
    "name": "Sweet and sour sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sucralose",
    "name": "Sucralose",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sugar",
    "name": "Sugar",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "also called sucrose",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tahini-paste",
    "name": "Tahini paste",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tamari-sauce",
    "name": "Tamari sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tamarind-paste",
    "name": "Tamarind paste",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tomato-sauce-outside-usa",
    "name": "Tomato sauce (outside USA)",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "2 sachets, 13g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "vegemite",
    "name": "Vegemite",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "apple-cider-vinegar-2-tbsp",
    "name": "Apple cider vinegar, 2 tbsp",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "balsamic-vinegar-2-tbsp",
    "name": "Balsamic vinegar, 2 tbsp",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-wine-vinegar",
    "name": "Rice wine vinegar",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "worcestershire-sauce",
    "name": "Worcestershire sauce",
    "category": "Condiments, Dips, Sweets, Sweeteners and Spreads",
    "fodmapLevel": "low",
    "limitText": "has onion and garlic but very very low amount making it low FODMAP",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "clear-spirits-such-as-vodka",
    "name": "Clear spirits such as Vodka",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gin",
    "name": "Gin",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "whiskey",
    "name": "Whiskey",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "espresso-coffee-regular-or-decaffeinated-black",
    "name": "Espresso coffee, regular or decaffeinated, black",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "espresso-coffee-regular-or-decaffeinated-with-up-to-250ml-lactose-free-milk",
    "name": "Espresso coffee, regular or decaffeinated, with up to 250ml lactose free milk",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "instant-coffee-regular-or-decaffeinated-black",
    "name": "Instant coffee, regular or decaffeinated, black",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "instant-coffee-regular-or-decaffeinated-with-up-to-250ml-lactose-free-milk",
    "name": "Instant coffee, regular or decaffeinated, with up to 250ml lactose free milk",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-milk",
    "name": "Coconut, milk",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "limitText": "125ml",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-water",
    "name": "Coconut, water",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "limitText": "100ml",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "drinking-chocolate-powder",
    "name": "Drinking chocolate powder",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-juice-125ml-and-safe-fruits-only",
    "name": "Fruit juice, 125ml and safe fruits only",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "kvass",
    "name": "Kvass",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lemonade",
    "name": "Lemonade",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "limitText": "in low quantities",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "egg-protein",
    "name": "Egg protein",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-protein",
    "name": "Rice protein",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sacha-inchi-protein",
    "name": "Sacha Inchi protein",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "whey-protein-isolate",
    "name": "Whey protein isolate",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soya-milk-made-with-soy-protein",
    "name": "Soya milk made with soy protein",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sugar-free-fizzy-drinks-soft-drinks-soda",
    "name": "Sugar free fizzy drinks / soft drinks / soda",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "limitText": "such as diet coke, in low quantities as aspartame and acesulfame k can be irritants",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sugar-fizzy-drinks-soft-drinks-soda-that-do-no-contain-hfcs-such-as-lemonade-cola-limit-intake-due-to-these-drinks-being-generally-unhealthy-and-can-cause-gut-irritation",
    "name": "'Sugar' fizzy drinks / soft drinks / soda that do no contain HFCS such as lemonade, cola. Limit intake due to these drinks being generally unhealthy and can cause gut irritation",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "black-tea-weak-e-g-pg-tips",
    "name": "Black tea, weak e.g. PG Tips",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chai-tea-weak",
    "name": "Chai tea, weak",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fruit-and-herbal-tea-weak",
    "name": "Fruit and herbal tea, weak",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "limitText": "ensure no apple added",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "green-tea",
    "name": "Green tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peppermint-tea",
    "name": "Peppermint tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "white-tea",
    "name": "White tea",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "water",
    "name": "Water",
    "category": "Drinks and Protein Powders",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "butter",
    "name": "Butter",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "american-cheese",
    "name": "American Cheese",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "16g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "brie",
    "name": "Brie",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "camembert",
    "name": "Camembert",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cheddar",
    "name": "Cheddar",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cottage",
    "name": "Cottage",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "2 tablespoons",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cream-cheese",
    "name": "Cream Cheese",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "2 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "feta",
    "name": "Feta",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "goat-chevre",
    "name": "Goat / chevre",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "haloumi",
    "name": "Haloumi",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "40g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "monterey-jack",
    "name": "Monterey Jack",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mozzarella",
    "name": "Mozzarella",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "paneer",
    "name": "Paneer",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "2 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "parmesan",
    "name": "Parmesan",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ricotta",
    "name": "Ricotta",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "2 tablespoons",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "swiss",
    "name": "Swiss",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "dairy-free-chocolate-pudding",
    "name": "Dairy free chocolate pudding",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "eggs",
    "name": "Eggs",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "margarine",
    "name": "Margarine",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "almond-milk",
    "name": "Almond milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "hemp-milk",
    "name": "Hemp milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "125ml",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lactose-free-milk",
    "name": "Lactose free milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "macadamia-milk",
    "name": "Macadamia milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oat-milk",
    "name": "Oat milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "30 ml, enough for cereal",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-milk",
    "name": "Rice milk",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "up to 200ml per sitting",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sorbet",
    "name": "Sorbet",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soy-protein-avoid-soya-beans",
    "name": "Soy protein (avoid soya beans)",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "swiss-cheese",
    "name": "Swiss cheese",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tempeh",
    "name": "Tempeh",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tofu",
    "name": "Tofu",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "drained and firm varieties",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "whipped-cream",
    "name": "Whipped cream",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-yoghurt",
    "name": "Coconut yoghurt",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "greek-yoghurt",
    "name": "Greek yoghurt",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "23g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lactose-free-yoghurt",
    "name": "Lactose free yoghurt",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "goats-yoghurt",
    "name": "Goats yoghurt",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soy-yoghurt",
    "name": "Soy yoghurt",
    "category": "Dairy Foods and Eggs",
    "fodmapLevel": "low",
    "limitText": "38g",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "basil",
    "name": "Basil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "bay-leaves",
    "name": "Bay leaves",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cilantro",
    "name": "Cilantro",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coriander",
    "name": "Coriander",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "curry-leaves",
    "name": "Curry leaves",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fenugreek",
    "name": "Fenugreek",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gotukala",
    "name": "Gotukala",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lemongrass",
    "name": "Lemongrass",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mint",
    "name": "Mint",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "oregano",
    "name": "Oregano",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "pandan",
    "name": "Pandan",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "parsley",
    "name": "Parsley",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rampa",
    "name": "Rampa",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rosemary",
    "name": "Rosemary",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sage",
    "name": "Sage",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tarragon",
    "name": "Tarragon",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "thyme",
    "name": "Thyme",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "all-spice",
    "name": "All spice",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "black-pepper",
    "name": "Black pepper",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cardamon",
    "name": "Cardamon",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chili-powder-check-ingredients",
    "name": "Chili powder (check ingredients",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sometimes-has-garlic-added",
    "name": "sometimes has garlic added)",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "chipotle-chili-powder",
    "name": "Chipotle chili powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cinnamon",
    "name": "Cinnamon",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cloves",
    "name": "Cloves",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cumin",
    "name": "Cumin",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "curry-powder",
    "name": "Curry powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "fennel-seeds",
    "name": "Fennel seeds",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "five-spice",
    "name": "Five spice",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "goraka",
    "name": "Goraka",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mustard-seeds",
    "name": "Mustard seeds",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "nutmeg",
    "name": "Nutmeg",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "paprika",
    "name": "Paprika",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "saffron",
    "name": "Saffron",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "star-anise",
    "name": "Star anise",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "turmeric",
    "name": "Turmeric",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "avocado-oil",
    "name": "Avocado oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "canola-oil",
    "name": "Canola oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "coconut-oil",
    "name": "Coconut oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "olive-oil",
    "name": "Olive oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "peanut-oil",
    "name": "Peanut oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "rice-bran-oil",
    "name": "Rice bran oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sesame-oil",
    "name": "Sesame oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "sunflower-oil",
    "name": "Sunflower oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "vegetable-oil",
    "name": "Vegetable oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "acai-powder",
    "name": "Acai powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "asafoetida-powder",
    "name": "Asafoetida powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "great onion substitute",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "baking-powder",
    "name": "Baking powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "baking-soda",
    "name": "Baking soda",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cacao-powder",
    "name": "Cacao powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cocoa-powder",
    "name": "Cocoa powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "cream-2-tablespoons",
    "name": "Cream, 2 tablespoons",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "gelatine",
    "name": "Gelatine",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "ghee-clarified-butter",
    "name": "Ghee, clarified butter",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "1 tbsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "icing-sugar",
    "name": "Icing sugar",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "lard",
    "name": "Lard",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "maca-powder",
    "name": "Maca Powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "mango-powder",
    "name": "Mango Powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "matcha-powder",
    "name": "Matcha Powder",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "1 tsp",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "nutritional-yeast",
    "name": "Nutritional yeast",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "salt",
    "name": "Salt",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "soybean-oil",
    "name": "Soybean oil",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "note": "low FODMAP (limit not specified in source)",
    "sourceTag": "low fodmap database.txt"
  },
  {
    "id": "tahini-hulled",
    "name": "Tahini, hulled",
    "category": "Cooking ingredients, Herbs and Spices",
    "fodmapLevel": "low",
    "limitText": "30g",
    "sourceTag": "low fodmap database.txt"
  }
];

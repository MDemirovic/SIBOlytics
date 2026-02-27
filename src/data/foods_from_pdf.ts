export interface FoodItem {
  id: string;
  name: string;
  category: string;
  fodmapLevel: 'low' | 'caution' | 'high';
  limitText?: string;
  note?: string;
  source: string;
}

export const foods: FoodItem[] = [
  {
    "id": "bananas",
    "name": "Bananas",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "blueberries",
    "name": "Blueberries",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cantaloupe",
    "name": "Cantaloupe",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "clementine",
    "name": "Clementine",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cranberries-limit",
    "name": "Cranberries",
    "category": "Fruits",
    "fodmapLevel": "caution",
    "limitText": "2 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "grapes",
    "name": "Grapes",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "honeydew-melon",
    "name": "Honeydew melon",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "kiwi",
    "name": "Kiwi",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lemon",
    "name": "Lemon",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lime",
    "name": "Lime",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "orange",
    "name": "Orange",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "passion-fruit",
    "name": "Passion fruit",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pineapple",
    "name": "Pineapple",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "raisins-limit",
    "name": "Raisins",
    "category": "Fruits",
    "fodmapLevel": "caution",
    "limitText": "1 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rhubarb",
    "name": "Rhubarb",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "starfruit",
    "name": "Starfruit",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "strawberries",
    "name": "Strawberries",
    "category": "Fruits",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "alfalfa",
    "name": "Alfalfa",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "arugula",
    "name": "Arugula",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bamboo-shoots",
    "name": "Bamboo shoots",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bean-sprouts",
    "name": "Bean sprouts",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bell-peppers-limit",
    "name": "Bell peppers",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "red, yellow",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bok-choy",
    "name": "Bok choy",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "broccoli-limit",
    "name": "Broccoli",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "½ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "brussels-sprouts-limit",
    "name": "Brussels sprouts",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "½ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "butternut-squash-limit",
    "name": "Butternut squash",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "¼ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "carrots",
    "name": "Carrots",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "celery-limit",
    "name": "Celery",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "½ stalk",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chives-limit",
    "name": "Chives",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "green part only",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "corn",
    "name": "Corn",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cucumber",
    "name": "Cucumber",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "eggplant",
    "name": "Eggplant",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "endive",
    "name": "Endive",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fennel-limit",
    "name": "Fennel",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "1 c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "ginger-root",
    "name": "Ginger root",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "green-beans",
    "name": "Green beans",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "kale",
    "name": "Kale",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lettuce",
    "name": "Lettuce",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "okra-limit",
    "name": "Okra",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "6 pods",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "parsnip",
    "name": "Parsnip",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "potato-limit",
    "name": "Potato",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "white",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "radish",
    "name": "Radish",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rutabaga",
    "name": "Rutabaga",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "spaghetti-squash",
    "name": "Spaghetti squash",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "spinach",
    "name": "Spinach",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "summer-squash",
    "name": "Summer squash",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "spring-onion-limit",
    "name": "Spring onion",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "green part only",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sweet-potato-limit",
    "name": "Sweet potato",
    "category": "Vegetables",
    "fodmapLevel": "caution",
    "limitText": "½ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "swiss-chard",
    "name": "Swiss chard",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tomatoes",
    "name": "Tomatoes",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "turnips",
    "name": "Turnips",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "yam",
    "name": "Yam",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "zucchini",
    "name": "Zucchini",
    "category": "Vegetables",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "almonds-limit",
    "name": "Almonds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "almond-butter-limit",
    "name": "Almond butter",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "brazil-nuts-limit",
    "name": "Brazil nuts",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chestnuts-limit",
    "name": "Chestnuts",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chia-seeds-limit",
    "name": "Chia seeds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "coconut-limit",
    "name": "Coconut",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "peanuts-limit",
    "name": "Peanuts",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "peanut-butter-limit",
    "name": "Peanut butter",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pecans-limit",
    "name": "Pecans",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pine-nuts-limit",
    "name": "Pine nuts",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "poppy-seeds-limit",
    "name": "Poppy seeds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pumpkin-seeds-limit",
    "name": "Pumpkin seeds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sesame-seeds-limit",
    "name": "Sesame seeds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sunflower-seeds-limit",
    "name": "Sunflower seeds",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "walnuts-limit",
    "name": "Walnuts",
    "category": "Nuts and Seeds",
    "fodmapLevel": "caution",
    "limitText": "2 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "breakfast-cereals-made-of-rice-or-corn-e-g-corn-flakes-rice-krispies-limit",
    "name": "Breakfast cereals made of rice or corn (e.g. corn flakes, rice krispies",
    "category": "Grains and Starches",
    "fodmapLevel": "caution",
    "limitText": "½ c)",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "buckwheat",
    "name": "Buckwheat",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cornmeal",
    "name": "Cornmeal",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "corn-tortillas-chips",
    "name": "Corn tortillas/chips",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "gluten-free-bread-limit",
    "name": "Gluten-free bread",
    "category": "Grains and Starches",
    "fodmapLevel": "caution",
    "limitText": "2 slices",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "gluten-free-pasta-limit",
    "name": "Gluten-free pasta",
    "category": "Grains and Starches",
    "fodmapLevel": "caution",
    "limitText": "½ c cooked",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "gluten-free-pretzels",
    "name": "Gluten-free pretzels",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "grits",
    "name": "Grits",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "millet",
    "name": "Millet",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "oats-limit",
    "name": "Oats",
    "category": "Grains and Starches",
    "fodmapLevel": "caution",
    "limitText": "½ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "polenta",
    "name": "Polenta",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "popcorn-plain-or-salted",
    "name": "Popcorn (plain or salted)",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "potato-chips-plain",
    "name": "Potato chips (plain)",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "quinoa",
    "name": "Quinoa",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rice",
    "name": "Rice",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rice-cakes",
    "name": "Rice cakes",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rice-noodles",
    "name": "Rice noodles",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tapioca",
    "name": "Tapioca",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "yams",
    "name": "Yams",
    "category": "Grains and Starches",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "beef",
    "name": "Beef",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chicken",
    "name": "Chicken",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "eggs-egg-substitute",
    "name": "Eggs / egg substitute",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fish",
    "name": "Fish",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lamb",
    "name": "Lamb",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pork",
    "name": "Pork",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "shellfish",
    "name": "Shellfish",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "turkey",
    "name": "Turkey",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chickpeas-limit",
    "name": "Chickpeas",
    "category": "Proteins",
    "fodmapLevel": "caution",
    "limitText": "½ c canned, drained",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "edamame-limit",
    "name": "Edamame",
    "category": "Proteins",
    "fodmapLevel": "caution",
    "limitText": "½ c, shelled",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lentils-limit",
    "name": "Lentils",
    "category": "Proteins",
    "fodmapLevel": "caution",
    "limitText": "½ c canned, drained",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "seitan",
    "name": "Seitan",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tempeh",
    "name": "Tempeh",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tofu",
    "name": "Tofu",
    "category": "Proteins",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "almond-milk",
    "name": "Almond Milk",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cheese-aged-including-cheddar-swiss-parmesan-brie-havarti-camembert",
    "name": "Cheese (aged, including cheddar, swiss, parmesan, brie, havarti, camembert)",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cheese-not-aged-including-feta-american-mozzarella-fresh-chevre-queso-fresco-limit",
    "name": "Cheese (not aged, including feta, American, mozzarella, fresh chevre, queso fresco)",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "caution",
    "limitText": "1 oz.",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "coconut-milk-limit",
    "name": "Coconut milk",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "caution",
    "limitText": "½ c, canned",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cream-cheese-limit",
    "name": "Cream cheese",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "caution",
    "limitText": "2 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "half-and-half-limit",
    "name": "Half and Half",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "caution",
    "limitText": "2 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "heavy-cream-limit",
    "name": "Heavy cream",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "caution",
    "limitText": "¼ c",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lactose-free-cottage-cheese",
    "name": "Lactose-free cottage cheese",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lactose-free-kefir",
    "name": "Lactose-free kefir",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lactose-free-sour-cream",
    "name": "Lactose-free sour cream",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lactose-free-yogurt-plain",
    "name": "Lactose-free yogurt (plain)",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rice-milk",
    "name": "Rice milk",
    "category": "Dairy / Dairy Alternatives",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "beer",
    "name": "Beer",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "black-tea-limit",
    "name": "Black tea",
    "category": "Beverages",
    "fodmapLevel": "caution",
    "limitText": "weak, 8 oz",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "coffee-limit",
    "name": "Coffee",
    "category": "Beverages",
    "fodmapLevel": "caution",
    "limitText": "black",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cocoa",
    "name": "Cocoa",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "espresso",
    "name": "Espresso",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "gin",
    "name": "Gin",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "ginger-tea",
    "name": "Ginger tea",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "green-tea",
    "name": "Green tea",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "peppermint-tea",
    "name": "Peppermint tea",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rooibos-tea",
    "name": "Rooibos tea",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "water",
    "name": "Water",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "whiskey",
    "name": "Whiskey",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "white-tea",
    "name": "White tea",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "wine",
    "name": "Wine",
    "category": "Beverages",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "avocado-limit",
    "name": "Avocado",
    "category": "Fats and Oils",
    "fodmapLevel": "caution",
    "limitText": "1 ½ Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "butter",
    "name": "Butter",
    "category": "Fats and Oils",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "margarine",
    "name": "Margarine",
    "category": "Fats and Oils",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "oil-limit",
    "name": "Oil",
    "category": "Fats and Oils",
    "fodmapLevel": "caution",
    "limitText": "olive, soybean, coconut, garlic-infused",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "allspice",
    "name": "Allspice",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "asafoetida",
    "name": "Asafoetida",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bakers-yeast",
    "name": "Bakers yeast",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "baking-powder-soda",
    "name": "Baking powder/soda",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "basil",
    "name": "Basil",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "bay-leaf",
    "name": "Bay leaf",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "black-pepper",
    "name": "Black pepper",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "capers",
    "name": "Capers",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cardamom",
    "name": "Cardamom",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chili-powder",
    "name": "Chili powder",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cilantro",
    "name": "Cilantro",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cinnamon",
    "name": "Cinnamon",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cocoa-powder-limit",
    "name": "Cocoa powder",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "caution",
    "limitText": "1 ½ Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "corn-starch",
    "name": "Corn starch",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "coriander",
    "name": "Coriander",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cumin",
    "name": "Cumin",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "curry-powder",
    "name": "Curry powder",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fennel-seeds",
    "name": "Fennel seeds",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "five-spice",
    "name": "Five spice",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "ginger",
    "name": "Ginger",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "lemongrass",
    "name": "Lemongrass",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "marjoram",
    "name": "Marjoram",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mint",
    "name": "Mint",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mayonnaise",
    "name": "Mayonnaise",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mustard",
    "name": "Mustard",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "nutmeg",
    "name": "Nutmeg",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "olives",
    "name": "Olives",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "oregano",
    "name": "Oregano",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "paprika",
    "name": "Paprika",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "parsley",
    "name": "Parsley",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pectin",
    "name": "Pectin",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rosemary",
    "name": "Rosemary",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "saffron",
    "name": "Saffron",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "salt",
    "name": "Salt",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sesame-oil",
    "name": "Sesame oil",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "star-anise",
    "name": "Star anise",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "soy-sauce",
    "name": "Soy sauce",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tamari",
    "name": "Tamari",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tarragon",
    "name": "Tarragon",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "tomato-paste",
    "name": "Tomato paste",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "thyme",
    "name": "Thyme",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "turmeric",
    "name": "Turmeric",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "vanilla",
    "name": "Vanilla",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "vinegar-limit",
    "name": "Vinegar",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "caution",
    "limitText": "balsamic, 1 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "wasabi",
    "name": "Wasabi",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "worcestershire-sauce",
    "name": "Worcestershire sauce",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "xanthan-gum",
    "name": "Xanthan gum",
    "category": "Condiments, Seasonings, and Baking Supplies",
    "fodmapLevel": "low",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "artificial-sweeteners-not-ending-in-ol-limit",
    "name": "Artificial sweeteners not ending in “-ol”",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "aspartame-limit",
    "name": "Aspartame",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "brown-sugar-limit",
    "name": "Brown sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cane-sugar-or-syrup-limit",
    "name": "Cane sugar or syrup",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "caster-sugar-limit",
    "name": "Caster sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "coconut-sugar-limit",
    "name": "Coconut sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "corn-syrup-not-high-fructose-limit",
    "name": "Corn syrup (NOT high-fructose)",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "dextrose-limit",
    "name": "Dextrose",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "glucose-limit",
    "name": "Glucose",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "golden-syrup-limit",
    "name": "Golden syrup",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "granulated-or-table-sugar-limit",
    "name": "Granulated or table sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "sucrose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "maltose-limit",
    "name": "Maltose",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "maple-syrup-100-pure-limit",
    "name": "Maple Syrup (100% pure)",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "palm-sugar-limit",
    "name": "Palm sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "raw-sugar-limit",
    "name": "Raw sugar",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "saccharine-limit",
    "name": "Saccharine",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "stevia-limit",
    "name": "Stevia",
    "category": "Sweeteners",
    "fodmapLevel": "caution",
    "limitText": "1 Tb per meal",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "candy-limit",
    "name": "Candy",
    "category": "Sweets and Desserts",
    "fodmapLevel": "caution",
    "limitText": "1 oz",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "dark-or-semisweet-chocolate-limit",
    "name": "Dark or semisweet chocolate",
    "category": "Sweets and Desserts",
    "fodmapLevel": "caution",
    "limitText": "1 oz",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "jam-or-jelly-limit",
    "name": "Jam or jelly",
    "category": "Sweets and Desserts",
    "fodmapLevel": "caution",
    "limitText": "1 Tb",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sorbet-or-sorbetto-limit",
    "name": "Sorbet or sorbetto",
    "category": "Sweets and Desserts",
    "fodmapLevel": "caution",
    "limitText": "1/2 c, FODMAP- friendly fruit flavors only",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "ricotta-cheese-high",
    "name": "Ricotta cheese",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cottage-cheese-high",
    "name": "cottage cheese",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "milk-cow-sheep-goat-high",
    "name": "Milk (cow, sheep, goat)",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "evaporated-milk-high",
    "name": "Evaporated milk",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "yogurt-high",
    "name": "yogurt",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "ice-cream-high",
    "name": "ice cream",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "custard-high",
    "name": "custard",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Lactose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "asparagus-high",
    "name": "Asparagus",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sugar-snap-peas-high",
    "name": "sugar snap peas",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sun-dried-tomatoes-high",
    "name": "sun-dried tomatoes",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "apples-high",
    "name": "Apples",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cherries-high",
    "name": "cherries",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fresh-figs-high",
    "name": "fresh figs",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mango-high",
    "name": "mango",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "pears-high",
    "name": "pears",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "watermelon-high",
    "name": "watermelon",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "agave-high",
    "name": "Agave",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "high-fructose-corn-syrup-high",
    "name": "high fructose corn syrup",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "honey-high",
    "name": "honey",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rum-high",
    "name": "Rum",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "Excess Fructose",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "artichokes-high",
    "name": "Artichokes",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "garlic-high",
    "name": "garlic",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "leek-and-scallion-bulbs-high",
    "name": "leek and scallion bulbs",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "shallots-high",
    "name": "shallots",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "onions-high",
    "name": "onions",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "onion-and-garlic-powder-high",
    "name": "onion and garlic powder",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "peas-high",
    "name": "peas",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "soybeans-high",
    "name": "soybeans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "kidney-beans-high",
    "name": "kidney beans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "banana-ripe-high",
    "name": "Banana (ripe)",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "currants-high",
    "name": "currants",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "dates-high",
    "name": "dates",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "dried-figs-high",
    "name": "dried figs",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "grapefruit-high",
    "name": "grapefruit",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "nectarine-high",
    "name": "nectarine",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "persimmon-high",
    "name": "persimmon",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "plums-high",
    "name": "plums",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "prunes-high",
    "name": "prunes",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "white-peaches-high",
    "name": "white peaches",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "rye-high",
    "name": "Rye",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "wheat-high",
    "name": "wheat",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "barley-high",
    "name": "barley",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mature-soybeans-most-soy-milk-and-soy-flour-high",
    "name": "Mature soybeans (most soy milk and soy flour)",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "baked-beans-high",
    "name": "baked beans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "black-beans-high",
    "name": "black beans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fava-beans-high",
    "name": "fava beans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "navy-beans-high",
    "name": "navy beans",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "split-peas-high",
    "name": "split peas",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "oolong-tea-high",
    "name": "Oolong tea",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chamomile-tea-high",
    "name": "chamomile tea",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fennel-tea-high",
    "name": "fennel tea",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "carob-high",
    "name": "carob",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "chicory-root-high",
    "name": "chicory root",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "inulin-high",
    "name": "inulin",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "fos-fructo-oligosaccharide-high",
    "name": "FOS (fructo-oligosaccharide)",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Fructans/GOS",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "cauliflower-high",
    "name": "Cauliflower",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mushrooms-high",
    "name": "mushrooms",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "snow-peas-high",
    "name": "snow peas",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "apricots-high",
    "name": "apricots",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "blackberries-high",
    "name": "blackberries",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "nectarines-high",
    "name": "nectarines",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "yellow-peaches-high",
    "name": "yellow peaches",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "sorbitol-high",
    "name": "Sorbitol",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "mannitol-high",
    "name": "mannitol",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "isomalt-high",
    "name": "isomalt",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  },
  {
    "id": "xylitol-high",
    "name": "xylitol",
    "category": "High-FODMAP Checklist",
    "fodmapLevel": "high",
    "note": "High Polyols",
    "source": "Low-FODMAP-Diet-and-Instructions-2023.pdf"
  }
];

const fs = require('fs');

const lowFruits = [
  "Bananas", "Blueberries", "Cantaloupe", "Clementine", "Cranberries (2 Tb)", "Grapes",
  "Honeydew melon", "Kiwi", "Lemon", "Lime", "Orange", "Passion fruit",
  "Pineapple", "Raisins (1 Tb)", "Rhubarb", "Starfruit", "Strawberries"
];

const lowVeg = [
  "Alfalfa", "Arugula", "Bamboo shoots", "Bean sprouts", "Bell peppers (red, yellow)",
  "Bok choy", "Broccoli (½ c)", "Brussels sprouts (½ c)", "Butternut squash (¼ c)",
  "Carrots", "Celery (½ stalk)", "Chives (green part only)", "Corn", "Cucumber",
  "Eggplant", "Endive", "Fennel (1 c)", "Ginger root", "Green beans", "Kale",
  "Lettuce", "Okra (6 pods)", "Parsnip", "Potato (white)", "Radish", "Rutabaga",
  "Spaghetti squash", "Spinach", "Summer squash", "Spring onion (green part only)",
  "Sweet potato (½ c)", "Swiss chard", "Tomatoes", "Turnips", "Yam", "Zucchini"
];

const lowNuts = [
  "Almonds", "Almond butter", "Brazil nuts", "Chestnuts", "Chia seeds", "Coconut",
  "Peanuts", "Peanut butter", "Pecans", "Pine nuts", "Poppy seeds", "Pumpkin seeds",
  "Sesame seeds", "Sunflower seeds", "Walnuts"
]; // Limit all to 2 Tb per meal

const lowGrains = [
  "Breakfast cereals made of rice or corn (e.g. corn flakes, rice krispies – ½ c)",
  "Buckwheat", "Cornmeal", "Corn tortillas/chips", "Gluten-free bread (2 slices)",
  "Gluten-free pasta (½ c cooked)", "Gluten-free pretzels", "Grits", "Millet",
  "Oats (½ c)", "Polenta", "Popcorn (plain or salted)", "Potato chips (plain)",
  "Quinoa", "Rice", "Rice cakes", "Rice noodles", "Tapioca", "Yams"
];

const lowProteins = [
  "Beef", "Chicken", "Eggs / egg substitute", "Fish", "Lamb", "Pork", "Shellfish", "Turkey",
  "Chickpeas (½ c canned, drained)", "Edamame (½ c, shelled)", "Lentils (½ c canned, drained)",
  "Seitan", "Tempeh", "Tofu"
];

const lowDairy = [
  "Almond Milk", "Cheese (aged, including cheddar, swiss, parmesan, brie, havarti, camembert)",
  "Cheese (1 oz. not aged, including feta, American, mozzarella, fresh chevre, queso fresco)",
  "Coconut milk ( ½ c, canned)", "Cream cheese (2 Tb)", "Half and Half (2 Tb)",
  "Heavy cream (¼ c)", "Lactose-free cottage cheese", "Lactose-free kefir",
  "Lactose-free sour cream", "Lactose-free yogurt (plain)", "Rice milk"
];

const lowBeverages = [
  "Beer", "Black tea (weak, 8 oz)", "Coffee (black)", "Cocoa", "Espresso", "Gin",
  "Ginger tea", "Green tea", "Peppermint tea", "Rooibos tea", "Water", "Whiskey",
  "White tea", "Wine"
];

const lowFats = [
  "Avocado (1 ½ Tb)", "Butter", "Coconut milk (½ c, canned)", "Margarine",
  "Oil (olive, soybean, coconut, garlic-infused)"
];

const lowCondiments = [
  "Allspice", "Asafoetida", "Bakers yeast", "Baking powder/soda", "Basil", "Bay leaf",
  "Black pepper", "Capers", "Cardamom", "Chili powder", "Chives (green part only)",
  "Cilantro", "Cinnamon", "Cocoa powder (1 ½ Tb)", "Corn starch", "Coriander", "Cumin",
  "Curry powder", "Fennel seeds", "Five spice", "Ginger", "Lemongrass", "Marjoram",
  "Mint", "Mayonnaise", "Mustard", "Nutmeg", "Olives", "Oregano", "Paprika", "Parsley",
  "Pectin", "Rosemary", "Saffron", "Salt", "Sesame oil", "Star anise", "Soy sauce",
  "Tamari", "Tarragon", "Tomato paste", "Thyme", "Turmeric", "Vanilla",
  "Vinegar (balsamic, 1 Tb)", "Vinegar (other types)", "Wasabi", "Worcestershire sauce",
  "Xanthan gum"
];

const lowSweeteners = [
  "Artificial sweeteners not ending in “-ol”", "Aspartame", "Brown sugar",
  "Cane sugar or syrup", "Caster sugar", "Coconut sugar", "Corn syrup (NOT high-fructose)",
  "Dextrose", "Glucose", "Golden syrup", "Granulated or table sugar (sucrose)",
  "Maltose", "Maple Syrup (100% pure)", "Palm sugar", "Raw sugar", "Saccharine", "Stevia"
]; // Limit all to 1 Tb per meal

const lowSweets = [
  "Candy (1 oz)", "Dark or semisweet chocolate (1 oz)", "Jam or jelly (1 Tb)",
  "Sorbet or sorbetto (1/2 c, FODMAP- friendly fruit flavors only)"
];

const highLactose = [
  "Ricotta cheese", "cottage cheese", "Milk (cow, sheep, goat)",
  "Evaporated milk", "yogurt", "ice cream", "custard"
];

const highFructose = [
  "Asparagus", "sugar snap peas", "sun-dried tomatoes",
  "Apples", "cherries", "fresh figs", "mango", "pears", "watermelon",
  "Agave", "high fructose corn syrup", "honey", "Rum"
];

const highFructans = [
  "Artichokes", "garlic", "leek and scallion bulbs", "shallots", "onions", "onion and garlic powder",
  "peas", "soybeans", "kidney beans",
  "Banana (ripe)", "currants", "dates", "dried figs", "grapefruit", "nectarine", "persimmon",
  "plums", "prunes", "white peaches", "watermelon",
  "Rye", "wheat", "barley",
  "Mature soybeans (most soy milk and soy flour)", "baked beans", "black beans", "fava beans",
  "kidney beans", "navy beans", "split peas",
  "Oolong tea", "chamomile tea", "fennel tea", "carob", "chicory root", "inulin", "FOS (fructo-oligosaccharide)"
];

const highPolyols = [
  "Cauliflower", "mushrooms", "snow peas",
  "Apples", "apricots", "blackberries", "cherries", "nectarines", "pears", "yellow peaches",
  "plums", "prunes", "watermelon",
  "Sorbitol", "mannitol", "isomalt", "xylitol"
];

const foods = [];
const seen = new Set();

const createId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const addLow = (list, category, globalLimit = null) => {
  for (let item of list) {
    let name = item;
    let limitText = globalLimit;
    
    // We only want to extract limitText if it contains a number or fraction
    const match = item.match(/(.*)\((.*?)\)/);
    if (match && !item.includes('e.g.') && !item.includes('aged') && !item.includes('NOT') && !item.includes('100%') && !item.includes('plain')) {
      const insideParens = match[2].trim();
      // Check if insideParens looks like a limit (has numbers, fractions, or specific words)
      if (/[0-9½¼]/.test(insideParens) || insideParens.includes('Tb') || insideParens.includes('oz') || insideParens.includes('stalk') || insideParens.includes('pods')) {
        name = match[1].trim();
        limitText = insideParens;
      } else {
        // It's just a note or description, keep it in the name
        name = item;
      }
    } else if (item.includes(' – ')) {
      const parts = item.split(' – ');
      name = parts[0].trim();
      limitText = parts[1].trim();
    } else if (item.includes(' (1 oz. not aged')) {
      name = "Cheese (not aged, including feta, American, mozzarella, fresh chevre, queso fresco)";
      limitText = "1 oz.";
    } else if (item.includes(' (aged, including')) {
      name = item;
      limitText = null;
    } else if (item.includes(' (weak, 8 oz)')) {
      name = "Black tea (weak)";
      limitText = "8 oz";
    } else if (item.includes(' (1 ½ Tb)')) {
      name = item.replace(' (1 ½ Tb)', '');
      limitText = "1 ½ Tb";
    } else if (item.includes(' (½ c, canned)')) {
      name = item.replace(' (½ c, canned)', '');
      limitText = "½ c, canned";
    } else if (item.includes(' (balsamic, 1 Tb)')) {
      name = "Vinegar (balsamic)";
      limitText = "1 Tb";
    } else if (item.includes(' (1 oz)')) {
      name = item.replace(' (1 oz)', '');
      limitText = "1 oz";
    } else if (item.includes(' (1 Tb)')) {
      name = item.replace(' (1 Tb)', '');
      limitText = "1 Tb";
    } else if (item.includes(' (1/2 c, FODMAP- friendly fruit flavors only)')) {
      name = "Sorbet or sorbetto (FODMAP-friendly fruit flavors only)";
      limitText = "1/2 c";
    }

    const id = createId(name + (limitText ? '-limit' : ''));
    if (!seen.has(id)) {
      seen.add(id);
      foods.push({
        id,
        name,
        category,
        fodmapLevel: limitText ? 'caution' : 'low',
        ...(limitText ? { limitText } : {}),
        source: "Low-FODMAP-Diet-and-Instructions-2023.pdf"
      });
    }
  }
};

addLow(lowFruits, "Fruits");
addLow(lowVeg, "Vegetables");
addLow(lowNuts, "Nuts and Seeds", "2 Tb per meal");
addLow(lowGrains, "Grains and Starches");
addLow(lowProteins, "Proteins");
addLow(lowDairy, "Dairy / Dairy Alternatives");
addLow(lowBeverages, "Beverages");
addLow(lowFats, "Fats and Oils");
addLow(lowCondiments, "Condiments, Seasonings, and Baking Supplies");
addLow(lowSweeteners, "Sweeteners", "1 Tb per meal");
addLow(lowSweets, "Sweets and Desserts");

const addHigh = (list, note) => {
  for (let item of list) {
    const id = createId(item + '-high');
    if (!seen.has(id)) {
      seen.add(id);
      foods.push({
        id,
        name: item,
        category: "High-FODMAP Checklist",
        fodmapLevel: 'high',
        note,
        source: "Low-FODMAP-Diet-and-Instructions-2023.pdf"
      });
    }
  }
};

addHigh(highLactose, "High Lactose");
addHigh(highFructose, "Excess Fructose");
addHigh(highFructans, "High Fructans/GOS");
addHigh(highPolyols, "High Polyols");

const tsContent = `export interface FoodItem {
  id: string;
  name: string;
  category: string;
  fodmapLevel: 'low' | 'caution' | 'high';
  limitText?: string;
  note?: string;
  source: string;
}

export const foods: FoodItem[] = ${JSON.stringify(foods, null, 2)};
`;

fs.writeFileSync('src/data/foods_from_pdf.ts', tsContent);
console.log('Done');

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  fodmapLevel: 'low' | 'medium' | 'high';
  servingNote: string;
  gramsSafe?: number;
  gramsLimit?: number;
  notes?: string;
}

export const foods: FoodItem[] = [
  { id: '1', name: 'Almonds', category: 'Nuts & Seeds', fodmapLevel: 'medium', servingNote: '10 nuts (12g)', gramsSafe: 12, gramsLimit: 24, notes: 'High in GOS at larger servings.' },
  { id: '2', name: 'Apple', category: 'Fruits', fodmapLevel: 'high', servingNote: '1 medium', notes: 'High in Fructose and Sorbitol.' },
  { id: '3', name: 'Avocado', category: 'Fruits', fodmapLevel: 'medium', servingNote: '1/8 whole (30g)', gramsSafe: 30, gramsLimit: 45, notes: 'Contains Sorbitol.' },
  { id: '4', name: 'Banana (Firm/Unripe)', category: 'Fruits', fodmapLevel: 'low', servingNote: '1 medium (100g)', gramsSafe: 100, notes: 'Fructans increase as it ripens.' },
  { id: '5', name: 'Banana (Ripe)', category: 'Fruits', fodmapLevel: 'high', servingNote: '1 medium', notes: 'High in Fructans.' },
  { id: '6', name: 'Bell Pepper (Red)', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1/2 cup (43g)', gramsSafe: 43, notes: 'Generally well tolerated.' },
  { id: '7', name: 'Blackberries', category: 'Fruits', fodmapLevel: 'high', servingNote: '1 cup', notes: 'High in Sorbitol.' },
  { id: '8', name: 'Blueberries', category: 'Fruits', fodmapLevel: 'low', servingNote: '1/4 cup (40g)', gramsSafe: 40, gramsLimit: 50, notes: 'Fructans at larger servings.' },
  { id: '9', name: 'Broccoli (Heads)', category: 'Vegetables', fodmapLevel: 'low', servingNote: '3/4 cup (75g)', gramsSafe: 75, notes: 'Stalks are higher in Fructans.' },
  { id: '10', name: 'Broccoli (Stalks)', category: 'Vegetables', fodmapLevel: 'high', servingNote: '1/2 cup', notes: 'High in Fructose.' },
  { id: '11', name: 'Carrot', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1 medium (61g)', gramsSafe: 61, notes: 'Generally well tolerated.' },
  { id: '12', name: 'Cauliflower', category: 'Vegetables', fodmapLevel: 'high', servingNote: '1 cup', notes: 'High in Mannitol.' },
  { id: '13', name: 'Chia Seeds', category: 'Nuts & Seeds', fodmapLevel: 'low', servingNote: '2 tbsp (24g)', gramsSafe: 24, notes: 'Good source of fiber.' },
  { id: '14', name: 'Chicken Breast', category: 'Proteins', fodmapLevel: 'low', servingNote: '1 fillet', notes: 'Proteins do not contain FODMAPs. Check marinades.' },
  { id: '15', name: 'Chickpeas (Canned)', category: 'Legumes', fodmapLevel: 'medium', servingNote: '1/4 cup (42g)', gramsSafe: 42, gramsLimit: 84, notes: 'Rinse well to reduce GOS.' },
  { id: '16', name: 'Cucumber', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1/2 cup (75g)', gramsSafe: 75, notes: 'Generally well tolerated.' },
  { id: '17', name: 'Eggs', category: 'Proteins', fodmapLevel: 'low', servingNote: '2 eggs', notes: 'Proteins do not contain FODMAPs.' },
  { id: '18', name: 'Garlic', category: 'Vegetables', fodmapLevel: 'high', servingNote: '1 clove', notes: 'Very high in Fructans. Avoid during elimination.' },
  { id: '19', name: 'Garlic-Infused Oil', category: 'Fats & Oils', fodmapLevel: 'low', servingNote: '1 tbsp', notes: 'Fructans are water-soluble, not fat-soluble. Safe to use.' },
  { id: '20', name: 'Grapes', category: 'Fruits', fodmapLevel: 'low', servingNote: '1 cup (150g)', gramsSafe: 150, notes: 'Generally well tolerated.' },
  { id: '21', name: 'Honey', category: 'Sweeteners', fodmapLevel: 'high', servingNote: '1 tbsp', notes: 'High in Fructose.' },
  { id: '22', name: 'Kiwi', category: 'Fruits', fodmapLevel: 'low', servingNote: '2 small (150g)', gramsSafe: 150, notes: 'Generally well tolerated.' },
  { id: '23', name: 'Lentils (Canned)', category: 'Legumes', fodmapLevel: 'medium', servingNote: '1/2 cup (46g)', gramsSafe: 46, gramsLimit: 65, notes: 'Rinse well to reduce GOS.' },
  { id: '24', name: 'Macadamia Nuts', category: 'Nuts & Seeds', fodmapLevel: 'low', servingNote: '20 nuts (40g)', gramsSafe: 40, notes: 'Generally well tolerated.' },
  { id: '25', name: 'Maple Syrup', category: 'Sweeteners', fodmapLevel: 'low', servingNote: '2 tbsp (50g)', gramsSafe: 50, notes: 'Generally well tolerated.' },
  { id: '26', name: 'Milk (Cow\'s)', category: 'Dairy', fodmapLevel: 'high', servingNote: '1 cup', notes: 'High in Lactose.' },
  { id: '27', name: 'Milk (Lactose-Free)', category: 'Dairy', fodmapLevel: 'low', servingNote: '1 cup (250ml)', gramsSafe: 250, notes: 'Lactose has been broken down.' },
  { id: '28', name: 'Oats (Rolled)', category: 'Grains', fodmapLevel: 'low', servingNote: '1/2 cup (52g)', gramsSafe: 52, gramsLimit: 78, notes: 'Fructans and GOS at larger servings.' },
  { id: '29', name: 'Onion', category: 'Vegetables', fodmapLevel: 'high', servingNote: '1/4 cup', notes: 'Very high in Fructans. Avoid during elimination.' },
  { id: '30', name: 'Peanuts', category: 'Nuts & Seeds', fodmapLevel: 'low', servingNote: '32 nuts (28g)', gramsSafe: 28, notes: 'Generally well tolerated.' },
  { id: '31', name: 'Potato', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1 medium (122g)', gramsSafe: 122, notes: 'Generally well tolerated.' },
  { id: '32', name: 'Quinoa', category: 'Grains', fodmapLevel: 'low', servingNote: '1 cup cooked (155g)', gramsSafe: 155, notes: 'Generally well tolerated.' },
  { id: '33', name: 'Rice (White/Brown)', category: 'Grains', fodmapLevel: 'low', servingNote: '1 cup cooked (190g)', gramsSafe: 190, notes: 'Generally well tolerated.' },
  { id: '34', name: 'Salmon', category: 'Proteins', fodmapLevel: 'low', servingNote: '1 fillet', notes: 'Proteins do not contain FODMAPs.' },
  { id: '35', name: 'Spinach (Baby)', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1.5 cups (75g)', gramsSafe: 75, gramsLimit: 150, notes: 'Fructans at larger servings.' },
  { id: '36', name: 'Strawberries', category: 'Fruits', fodmapLevel: 'low', servingNote: '5 medium (65g)', gramsSafe: 65, gramsLimit: 75, notes: 'Fructose at larger servings.' },
  { id: '37', name: 'Sweet Potato', category: 'Vegetables', fodmapLevel: 'medium', servingNote: '1/2 cup (75g)', gramsSafe: 75, gramsLimit: 100, notes: 'Contains Mannitol.' },
  { id: '38', name: 'Tofu (Firm)', category: 'Proteins', fodmapLevel: 'low', servingNote: '2/3 cup (170g)', gramsSafe: 170, notes: 'FODMAPs are drained with the water.' },
  { id: '39', name: 'Tofu (Silken)', category: 'Proteins', fodmapLevel: 'high', servingNote: '1/2 cup', notes: 'High in GOS and Fructans.' },
  { id: '40', name: 'Tomato (Common)', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1/2 medium (65g)', gramsSafe: 65, gramsLimit: 75, notes: 'Fructose at larger servings.' },
  { id: '41', name: 'Walnuts', category: 'Nuts & Seeds', fodmapLevel: 'low', servingNote: '10 halves (30g)', gramsSafe: 30, notes: 'Generally well tolerated.' },
  { id: '42', name: 'Watermelon', category: 'Fruits', fodmapLevel: 'high', servingNote: '1 cup', notes: 'High in Fructose, Mannitol, and Fructans.' },
  { id: '43', name: 'Wheat Bread', category: 'Grains', fodmapLevel: 'high', servingNote: '1 slice', notes: 'High in Fructans.' },
  { id: '44', name: 'Zucchini', category: 'Vegetables', fodmapLevel: 'low', servingNote: '1/3 cup (65g)', gramsSafe: 65, gramsLimit: 75, notes: 'Fructans at larger servings.' }
];

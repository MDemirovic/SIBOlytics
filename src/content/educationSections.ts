export interface EducationSection {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  evidenceNote: string;
  optionalLinks?: { label: string; url: string }[];
}

export const educationSections: EducationSection[] = [
  {
    id: 'what-is-sibo',
    title: '1. What is SIBO & Microbial Overgrowth Syndromes?',
    summary: 'Small Intestinal Bacterial Overgrowth (SIBO) is part of a broader category of microbial overgrowth syndromes where bacteria or archaea abnormally accumulate in the small intestine.',
    bullets: [
      'SIBO is characterized by an abnormal increase in the bacterial population in the small intestine, primarily driven by E. coli and Klebsiella.',
      'These bacteria are "disruptors" that ferment carbohydrates rapidly, producing large amounts of gas.',
      'Other overgrowth syndromes include Intestinal Methanogen Overgrowth (IMO) driven by Methanobrevibacter smithii, and excessive Hydrogen Sulfide (H2S) production.',
      'Microbial overgrowth is not just "colon bacteria moving up," but specific bad actors taking over the small bowel.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'sibo-and-ibs',
    title: '2. How SIBO Relates to IBS',
    summary: 'Irritable Bowel Syndrome (IBS) has historically been a "catch-all" diagnosis, but research shows a significant overlap with SIBO.',
    bullets: [
      'Up to 60% of IBS cases (particularly IBS-D and IBS-C) may actually be driven by SIBO or IMO.',
      'IBS is often diagnosed when all other tests (endoscopy, CT scans) are negative, making it a diagnosis of exclusion.',
      'Recognizing SIBO as a primary driver of IBS symptoms shifts the focus from managing a mysterious syndrome to treating a measurable microbial imbalance.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'root-causes-motility',
    title: '3. Root Causes & The Migrating Motor Complex (MMC)',
    summary: 'SIBO is always caused by an underlying issue, most commonly a failure of the small intestine\'s natural cleaning waves.',
    bullets: [
      'The Migrating Motor Complex (MMC) acts as a "cleaning wave" that sweeps residual food and bacteria out of the small intestine during fasting.',
      'When the MMC is impaired or slowed down, bacteria have the opportunity to multiply and overgrow.',
      'Other causes of impaired motility can include anatomical issues (like adhesions or endometriosis), certain medications (like narcotics or GLP-1 agonists), and immune deficiencies.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'post-infectious-ibs',
    title: '4. Post-Infectious IBS (Food Poisoning Connection)',
    summary: 'A major root cause of SIBO and IBS is a history of acute gastroenteritis, commonly known as food poisoning.',
    bullets: [
      'Bacteria that cause food poisoning (like Campylobacter, E. coli, Salmonella) release a specific toxin called CdtB.',
      'The body creates antibodies to fight CdtB, but these can cross-react with a naturally occurring protein in the gut called vinculin.',
      'This autoimmune-like response damages the nerves responsible for the MMC, leading to impaired motility and eventually SIBO.',
      'The risk of developing IBS increases significantly after a severe bout of food poisoning.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'antibodies',
    title: '5. Antibodies (Anti-CdtB & Anti-Vinculin)',
    summary: 'Blood tests can now detect the antibodies linked to post-infectious IBS, helping to identify the root cause of motility issues.',
    bullets: [
      'Testing for anti-CdtB and anti-vinculin antibodies can confirm if food poisoning initiated the gut dysfunction.',
      'Elevated anti-vinculin levels suggest ongoing nerve impairment in the gut, which correlates with reduced cleaning waves.',
      'These markers are highly predictive for diarrhea-predominant IBS (IBS-D) and mixed IBS, though they can occasionally appear in constipation (IMO).',
      'Tracking these antibodies over time may help guide the duration of prokinetic therapy.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only. Not a medical diagnosis.'
  },
  {
    id: 'breath-testing-basics',
    title: '6. Breath Testing Basics',
    summary: 'Breath testing is a non-invasive way to measure the gases produced by gut microbes after consuming a substrate sugar.',
    bullets: [
      'Lactulose and glucose are the most common substrates. Recent data suggests lactulose is highly effective for identifying SIBO when using a 90-minute cutoff.',
      'A rise in hydrogen (≥20 ppm) within 90 minutes is the standard threshold for a positive hydrogen SIBO test.',
      'Timing matters: An early rise (≤90 min) strongly suggests small intestinal overgrowth, while a later rise (>90 min) may reflect normal colonic fermentation.',
      'Breath tests are quantitative—higher gas levels generally correlate with a higher load of the respective microbes.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'three-gas-testing',
    title: '7. Three-Gas Breath Testing (H2, CH4, H2S)',
    summary: 'Modern breath testing measures three distinct gases: Hydrogen (H2), Methane (CH4), and Hydrogen Sulfide (H2S), providing a more complete picture.',
    bullets: [
      'Hydrogen (H2): Produced by bacteria like E. coli and Klebsiella; associated with diarrhea and bloating.',
      'Methane (CH4): Produced by archaea (M. smithii); strongly linked to constipation because methane gas actively slows gut transit.',
      'Hydrogen Sulfide (H2S): A highly reactive gas linked to severe diarrhea, urgency, and pain. It can cause a "flatline" on older two-gas tests because H2S producers consume hydrogen.',
      'Measuring all three gases prevents false negatives and guides more targeted therapeutic approaches.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'patterns-overview',
    title: '8. Common Gas Patterns',
    summary: 'Different gas profiles correspond to different predominant symptoms and underlying microbial imbalances.',
    bullets: [
      'Hydrogen-Dominant: Typically presents with diarrhea, bloating, and rapid gas production shortly after eating.',
      'Methane-Dominant (IMO): Characterized by constipation. Methanogens consume hydrogen to produce methane, which acts as a localized paralytic/spasmodic agent in the gut.',
      'Hydrogen Sulfide-Dominant: Often presents with severe diarrhea, urgency, and heightened visceral pain. H2S creates a highly inflammatory environment in the gut.',
      'Mixed Patterns: It is possible to have elevations in multiple gases, leading to alternating or mixed bowel habits.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'treatment-approaches',
    title: '9. Educational Overview of Treatments',
    summary: 'Treatment strategies aim to reduce the microbial overgrowth and restore normal gut motility. (Always consult a doctor).',
    bullets: [
      'Antibiotics: Rifaximin is commonly used for hydrogen SIBO because it stays in the gut. For methane, it is often combined with neomycin or metronidazole.',
      'Hydrogen Sulfide: Bismuth (e.g., Pepto-Bismol) is sometimes used alongside antibiotics to help bind the sulfide gas.',
      'Elemental Diet: A liquid diet that absorbs rapidly in the upper GI tract, starving the bacteria while nourishing the patient. Often used when antibiotics fail.',
      'Emerging Therapies: Research is ongoing into targeted methane inhibitors and mucolytics (like NAC) to break down mucus where bacteria hide.',
      'Relapse Prevention: Prokinetics (motility agents) are crucial post-treatment to keep the MMC active and prevent bacteria from returning.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only. Do not attempt treatments without medical supervision.'
  },
  {
    id: 'common-misconceptions',
    title: '10. Common Misconceptions',
    summary: 'Several outdated ideas about SIBO and IBS persist, despite new scientific evidence.',
    bullets: [
      '"IBS is just in your head": False. While stress can exacerbate symptoms, IBS is a physical disease often rooted in microbiome changes and nerve damage.',
      '"SIBO is caused by colon bacteria moving up": False. Shotgun sequencing shows SIBO is primarily an overgrowth of specific disruptors like E. coli and Klebsiella.',
      '"Probiotics cure SIBO": Caution is needed. Some probiotics (like certain Lactobacillus strains) may actually contribute to small bowel overgrowth or brain fog.',
      '"You must stay on a restrictive diet forever": False. Diets like Low FODMAP are meant for temporary symptom management, not long-term cures.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'when-to-seek-care',
    title: '11. When to Seek Medical Care',
    summary: 'While SIBO causes significant discomfort, certain "red flag" symptoms require immediate medical evaluation to rule out more serious conditions.',
    bullets: [
      'Unintentional or rapid weight loss.',
      'Blood in the stool or severe, unremitting abdominal pain.',
      'Symptoms that wake you up from sleep.',
      'Anemia or other unexplained nutritional deficiencies.',
      'If treatments are failing, doctors must investigate other causes like adhesions, endometriosis, or inflammatory bowel disease (IBD).'
    ],
    evidenceNote: 'Educational heuristic. Always discuss red flags with your gastroenterologist.'
  },
  {
    id: 'faq',
    title: '12. Frequently Asked Questions',
    summary: 'Quick answers to common questions about SIBO management and nuances.',
    bullets: [
      'Endometriosis: Can cause SIBO by physically pressing on the bowel and impairing motility.',
      'Food Reactions: Bloating today might be caused by food eaten 2-3 days ago, making it very hard to pinpoint triggers without a structured approach.',
      'Methane & Weight: Methanogens can extract extra calories from food, which may contribute to weight gain or difficulty losing weight.',
      'Treatment Timing: It is generally recommended to wait 2-3 weeks after finishing a treatment protocol before retesting or judging its full success.'
    ],
    evidenceNote: 'Based on Pimentel 2026 research; educational only.'
  },
  {
    id: 'practical-reading-framework',
    title: '13. Practical Breath Test Reading (Pimentel Framework)',
    summary: 'A practical sequence for reading a SIBO/IMO breath report in clinic-style order.',
    bullets: [
      'Step 1: Check baseline values first, then analyze the first 90 minutes. High baseline values can reduce interpretation quality if preparation was suboptimal.',
      'Step 2: Hydrogen-positive pattern is defined as >=20 ppm rise from baseline by 90 minutes (North American Consensus).',
      'Step 3: Methane-positive pattern (IMO) is defined as methane >=10 ppm at any point during the test and is commonly linked to constipation phenotype.',
      'Step 4: A late-only hydrogen rise (after 90 min) is more compatible with colonic fermentation than classic small-bowel overgrowth.',
      'Step 5: Substrate context matters: glucose is often more specific (but can miss distal overgrowth), while lactulose is more sensitive (but can include late colonic signal).',
      'Step 6: Always combine gas pattern + symptom phenotype + test preparation quality before treatment decisions.'
    ],
    evidenceNote: 'Educational summary based on North American Consensus and Pimentel-led literature; not a diagnosis.',
    optionalLinks: [
      {
        label: 'North American Consensus on Breath Testing (2017)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28323273/'
      },
      {
        label: 'ACG Clinical Guideline: SIBO (2020)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32023228/'
      },
      {
        label: 'Methane slows intestinal transit (Pimentel et al., 2006)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16630746/'
      },
      {
        label: 'Post-infectious IBS biomarker model (Pimentel et al., 2015)',
        url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0126438'
      }
    ]
  }
];

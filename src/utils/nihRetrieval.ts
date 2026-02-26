// Simple MVP retrieval for NIH Knowledge Base

const kbFiles = [
  {
    id: 'sibo_overview',
    title: 'SIBO Overview',
    url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/small-intestinal-bacterial-overgrowth-sibo',
    content: 'Small intestinal bacterial overgrowth (SIBO) is a condition in which there is an abnormal increase in the overall bacterial population in the small intestine. It is often characterized by symptoms such as bloating, abdominal pain, diarrhea, and malabsorption. SIBO can occur when the normal mechanisms that control bacterial populations in the small intestine, such as gastric acid secretion and intestinal motility (the migrating motor complex), are disrupted.'
  },
  {
    id: 'breath_tests_overview',
    title: 'Breath Tests Overview',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5418558/',
    content: 'Breath testing is a non-invasive method used to aid in the diagnosis of SIBO. It measures the levels of hydrogen and methane gases produced by bacterial fermentation of a substrate (such as glucose or lactulose) in the gut. A rise in hydrogen of ≥20 ppm from baseline within 90 minutes is generally considered positive for hydrogen-predominant SIBO. A methane level of ≥10 ppm at any point during the test is considered positive for intestinal methanogen overgrowth (IMO).'
  },
  {
    id: 'ibs_overlap',
    title: 'IBS Overlap',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3093012/',
    content: 'There is a significant overlap between Irritable Bowel Syndrome (IBS) and SIBO. Studies suggest that a substantial proportion of patients diagnosed with IBS may actually have underlying SIBO, particularly those with diarrhea-predominant IBS (IBS-D). Symptoms of both conditions are highly similar, including bloating, altered bowel habits, and abdominal discomfort.'
  },
  {
    id: 'fodmap_and_diet',
    title: 'FODMAP and Diet',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3966170/',
    content: 'A low-FODMAP diet is often recommended to manage symptoms of SIBO and IBS. FODMAPs are fermentable oligosaccharides, disaccharides, monosaccharides, and polyols—short-chain carbohydrates that are poorly absorbed in the small intestine. When these carbohydrates reach the bacteria in the gut, they are rapidly fermented, producing gas and drawing water into the intestine, which can exacerbate symptoms like bloating and diarrhea.'
  }
];

export interface RetrievedChunk {
  id: string;
  title: string;
  url: string;
  content: string;
  score: number;
}

export function retrieveNIHContext(query: string): RetrievedChunk[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return [];

  const scored = kbFiles.map(file => {
    let score = 0;
    const text = (file.title + ' ' + file.content).toLowerCase();
    terms.forEach(term => {
      if (text.includes(term)) {
        score += 1;
      }
    });
    return { ...file, score };
  });

  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
}

export function generateNIHAnswer(query: string): { answer: string, citations: RetrievedChunk[] } {
  const chunks = retrieveNIHContext(query);
  
  if (chunks.length === 0) {
    return {
      answer: "I don't have enough NIH-sourced evidence to answer that. Please try rephrasing or ask about SIBO, breath tests, IBS overlap, or FODMAPs.",
      citations: []
    };
  }

  // MVP: deterministic summarizer / paraphraser
  // In a real app, we would send these chunks to an LLM.
  const answer = chunks.map(c => c.content).join('\n\n');
  
  return {
    answer,
    citations: chunks
  };
}

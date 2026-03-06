// Simple MVP retrieval for NIH Knowledge Base

export interface RetrievedChunk {
  id: string;
  title: string;
  url: string;
  content: string;
  score: number;
}

interface CachedDoc {
  url: string;
  title: string;
  dateFetched: string;
  chunks: string[];
}

// Load all cache files at build time using Vite's import.meta.glob
const cacheModules = (import.meta as any).glob('../nih_kb/cache/*.json', { eager: true });

// Build the internal list of chunks
const kbChunks: Omit<RetrievedChunk, 'score'>[] = [];

Object.values(cacheModules).forEach((module) => {
  const doc = module as CachedDoc;
  if (doc && doc.chunks && Array.isArray(doc.chunks)) {
    doc.chunks.forEach((chunkText, index) => {
      kbChunks.push({
        id: `${doc.url}-chunk-${index}`,
        title: doc.title,
        url: doc.url,
        content: chunkText
      });
    });
  }
});

export function retrieveNIHContext(query: string): RetrievedChunk[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0 || kbChunks.length === 0) return [];

  const scored = kbChunks.map(chunk => {
    let score = 0;
    const text = (chunk.title + ' ' + chunk.content).toLowerCase();
    terms.forEach(term => {
      if (text.includes(term)) {
        score += 1;
      }
    });
    return { ...chunk, score };
  });

  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 2); //vraca top 2 rezultata
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


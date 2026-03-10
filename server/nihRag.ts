import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {GoogleGenAI} from '@google/genai';
import lunr from 'lunr';

export type NihLanguage = 'en' | 'hr';

type CachedDoc = {
  url: string;
  title: string;
  dateFetched: string;
  chunks: string[];
};

type ChunkRecord = {
  id: string;
  title: string;
  url: string;
  content: string;
};

export type NihCitation = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  content: string;
};

const defaultTopK = Number(process.env.NIH_TOP_K ?? 6);
const cacheDir = path.resolve(process.cwd(), 'src', 'nih_kb', 'cache');

let cachedChunks: ChunkRecord[] = [];
let index: lunr.Index | null = null;

const geminiApiKey = (process.env.GEMINI_API_KEY ?? '').trim();
const geminiModel = (process.env.NIH_LLM_MODEL ?? 'gemini-2.0-flash').trim();
const ai = geminiApiKey ? new GoogleGenAI({apiKey: geminiApiKey}) : null;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  const terms = normalizeText(value).split(' ').filter((token) => token.length > 2);
  const uniqueTerms = new Set<string>();
  for (const term of terms) uniqueTerms.add(term);
  return [...uniqueTerms];
}

function toSnippet(content: string, queryTerms: string[]): string {
  const clean = content.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (queryTerms.length === 0) return clean.slice(0, 260);

  const lower = clean.toLowerCase();
  const firstMatch = queryTerms
    .map((term) => lower.indexOf(term))
    .filter((pos) => pos >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatch === undefined) return clean.slice(0, 260);
  const start = Math.max(0, firstMatch - 60);
  const end = Math.min(clean.length, start + 260);
  return clean.slice(start, end);
}

function loadCacheDocs(): ChunkRecord[] {
  if (!existsSync(cacheDir)) return [];
  const files = readdirSync(cacheDir).filter((name) => name.endsWith('.json'));
  const rows: ChunkRecord[] = [];

  for (const fileName of files) {
    try {
      const fullPath = path.join(cacheDir, fileName);
      const raw = readFileSync(fullPath, 'utf-8');
      const doc = JSON.parse(raw) as CachedDoc;
      if (!doc || !Array.isArray(doc.chunks)) continue;

      doc.chunks.forEach((chunk, chunkIndex) => {
        const content = String(chunk ?? '').replace(/\s+/g, ' ').trim();
        if (!content) return;
        rows.push({
          id: `${fileName}::${chunkIndex}`,
          title: String(doc.title ?? doc.url ?? 'NIH source'),
          url: String(doc.url ?? ''),
          content,
        });
      });
    } catch {
      // Skip malformed cache files.
    }
  }

  return rows;
}

function ensureIndex() {
  if (index && cachedChunks.length > 0) return;
  cachedChunks = loadCacheDocs();
  if (cachedChunks.length === 0) {
    index = null;
    return;
  }

  index = lunr(function build() {
    this.ref('id');
    this.field('title');
    this.field('content');
    for (const chunk of cachedChunks) {
      this.add(chunk);
    }
  });
}

function keywordScore(chunk: ChunkRecord, queryTerms: string[]) {
  if (queryTerms.length === 0) return 0;
  const text = normalizeText(`${chunk.title} ${chunk.content}`);
  let score = 0;
  for (const term of queryTerms) {
    if (!text.includes(term)) continue;
    score += 1;
    if (normalizeText(chunk.title).includes(term)) score += 1.5;
  }
  return score;
}

export function retrieveNihCitations(question: string, topK = defaultTopK): NihCitation[] {
  ensureIndex();
  if (!index || cachedChunks.length === 0) return [];

  const queryTerms = tokenize(question);
  if (queryTerms.length === 0) return [];

  const scored = new Map<string, {chunk: ChunkRecord; lunrScore: number; keyword: number}>();

  try {
    const lunrQuery = queryTerms.map((term) => `${term}*`).join(' ');
    const lunrHits = index.search(lunrQuery).slice(0, Math.max(25, topK * 4));
    for (const hit of lunrHits) {
      const chunk = cachedChunks.find((item) => item.id === hit.ref);
      if (!chunk) continue;
      scored.set(chunk.id, {
        chunk,
        lunrScore: hit.score,
        keyword: keywordScore(chunk, queryTerms),
      });
    }
  } catch {
    // If lunr query parser fails, we still use keyword-only ranking.
  }

  for (const chunk of cachedChunks) {
    if (scored.has(chunk.id)) continue;
    const key = keywordScore(chunk, queryTerms);
    if (key <= 0) continue;
    scored.set(chunk.id, {chunk, lunrScore: 0, keyword: key});
  }

  const ranked = [...scored.values()]
    .sort((a, b) => (b.lunrScore + b.keyword) - (a.lunrScore + a.keyword))
    .slice(0, Math.max(1, topK));

  return ranked.map((item, indexInList) => ({
    id: `C${indexInList + 1}`,
    title: item.chunk.title,
    url: item.chunk.url,
    snippet: toSnippet(item.chunk.content, queryTerms),
    content: item.chunk.content,
  }));
}

function buildPrompt(question: string, citations: NihCitation[], language: NihLanguage): string {
  const languageInstruction = language === 'hr'
    ? 'Odgovaraj na hrvatskom jeziku.'
    : 'Answer in English.';

  const contextBlock = citations
    .map((citation) => `[${citation.id}] Title: ${citation.title}\nURL: ${citation.url}\nContent: ${citation.content}`)
    .join('\n\n');

  return [
    'You are NIH Evidence Bot for SIBOlytics.',
    'Use ONLY the provided NIH context.',
    'Do not use external knowledge.',
    'If context is insufficient, say so explicitly.',
    'Every factual claim must include citation tokens in format [C#].',
    languageInstruction,
    '',
    `User question: ${question}`,
    '',
    'Context:',
    contextBlock,
    '',
    'Return concise answer with citations.',
  ].join('\n');
}

export async function generateNihAnswer(
  question: string,
  language: NihLanguage,
  citations: NihCitation[]
): Promise<{answer: string; model: string}> {
  if (!ai) {
    throw Object.assign(new Error('Gemini API key is not configured.'), {status: 500, code: 'UPSTREAM_ERROR'});
  }

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: buildPrompt(question, citations, language),
    config: {
      temperature: 0.2,
      maxOutputTokens: 350,
    },
  });

  const answer = String(response.text ?? '').trim();
  if (!answer) {
    throw Object.assign(new Error('Model returned empty content.'), {status: 502, code: 'UPSTREAM_ERROR'});
  }

  return {
    answer,
    model: response.modelVersion ?? geminiModel,
  };
}

export function extractValidCitationIds(answer: string, allowedIds: Set<string>): string[] {
  const matches = answer.match(/\[C\d+\]/g) ?? [];
  const valid = new Set<string>();
  for (const match of matches) {
    const id = match.slice(1, -1);
    if (allowedIds.has(id)) valid.add(id);
  }
  return [...valid];
}

export function isQuotaError(error: unknown): boolean {
  const anyError = error as any;
  const message = String(anyError?.message ?? '').toLowerCase();
  const status = Number(anyError?.status ?? anyError?.statusCode ?? anyError?.code ?? NaN);
  return (
    status === 429 ||
    message.includes('quota') ||
    message.includes('resource exhausted') ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  );
}

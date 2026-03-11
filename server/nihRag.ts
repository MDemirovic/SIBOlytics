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

export type GenerateNihAnswerOptions = {
  forceCitationTokens?: boolean;
};

type NihLlmProvider = 'gemini' | 'groq';

const defaultTopK = Number(process.env.NIH_TOP_K ?? 6);
const cacheDir = path.resolve(process.cwd(), 'src', 'nih_kb', 'cache');

let cachedChunks: ChunkRecord[] = [];
let index: lunr.Index | null = null;

const geminiApiKey = (process.env.GEMINI_API_KEY ?? '').trim();
const geminiModel = (process.env.NIH_LLM_MODEL ?? 'gemini-2.0-flash').trim();
const groqApiKey = (process.env.GROQ_API_KEY ?? '').trim();
const groqModel = (process.env.NIH_GROQ_MODEL ?? 'llama-3.1-8b-instant').trim();
const providerRaw = (process.env.NIH_LLM_PROVIDER ?? '').trim().toLowerCase();
const llmProvider: NihLlmProvider = providerRaw === 'groq' ? 'groq' : 'gemini';

const geminiClient = geminiApiKey ? new GoogleGenAI({apiKey: geminiApiKey}) : null;

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
      const raw = readFileSync(fullPath, 'utf-8').replace(/^\uFEFF/, '');
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
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown parse error';
      console.warn(`[NIH_CACHE_SKIP] ${fileName}: ${reason}`);
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

function buildPrompt(
  question: string,
  citations: NihCitation[],
  language: NihLanguage,
  forceCitationTokens = false
): string {
  const languageInstruction = language === 'hr'
    ? 'Odgovaraj na hrvatskom jeziku.'
    : 'Answer in English.';
  const allowedCitationTokens = citations.map((citation) => `[${citation.id}]`).join(', ');

  const contextBlock = citations
    .map((citation) => `[${citation.id}] Title: ${citation.title}\nURL: ${citation.url}\nContent: ${citation.content}`)
    .join('\n\n');

  const citationFormatInstructions = forceCitationTokens
    ? [
        `Allowed citation tokens: ${allowedCitationTokens}.`,
        'You MUST include at least one allowed citation token exactly as written (example: [C1]).',
        'If context is insufficient, say so and still cite the closest available context token.',
      ]
    : [
        `Allowed citation tokens: ${allowedCitationTokens}.`,
        'Every factual claim must include citation tokens in format [C#].',
      ];

  return [
    'You are NIH Evidence Bot for SIBOlytics.',
    'Use ONLY the provided NIH context.',
    'Do not use external knowledge.',
    'If context is insufficient, say so explicitly.',
    ...citationFormatInstructions,
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

async function generateWithGemini(prompt: string): Promise<{answer: string; model: string}> {
  if (!geminiClient) {
    throw Object.assign(new Error('Gemini API key is not configured.'), {status: 500, code: 'UPSTREAM_ERROR'});
  }

  const response = await geminiClient.models.generateContent({
    model: geminiModel,
    contents: prompt,
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

async function generateWithGroq(prompt: string): Promise<{answer: string; model: string}> {
  if (!groqApiKey) {
    throw Object.assign(new Error('Groq API key is not configured.'), {status: 500, code: 'UPSTREAM_ERROR'});
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages: [{role: 'user', content: prompt}],
      temperature: 0.2,
      max_tokens: 350,
    }),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = String(
      payload?.error?.message ??
      payload?.message ??
      `Groq request failed with status ${response.status}.`
    );
    throw Object.assign(new Error(message), {
      status: response.status,
      code: payload?.error?.code ?? 'UPSTREAM_ERROR',
    });
  }

  const answer = String(payload?.choices?.[0]?.message?.content ?? '').trim();
  if (!answer) {
    throw Object.assign(new Error('Model returned empty content.'), {status: 502, code: 'UPSTREAM_ERROR'});
  }

  return {
    answer,
    model: String(payload?.model ?? groqModel),
  };
}

export async function generateNihAnswer(
  question: string,
  language: NihLanguage,
  citations: NihCitation[],
  options: GenerateNihAnswerOptions = {}
): Promise<{answer: string; model: string}> {
  const prompt = buildPrompt(question, citations, language, Boolean(options.forceCitationTokens));
  if (llmProvider === 'groq') return generateWithGroq(prompt);
  return generateWithGemini(prompt);
}

export function extractValidCitationIds(answer: string, allowedIds: Set<string>): string[] {
  const valid = new Set<string>();
  const registerId = (rawId: string) => {
    const compact = rawId.replace(/\s+/g, '').toUpperCase();
    const normalized = /^\d+$/.test(compact) ? `C${compact}` : compact;
    if (allowedIds.has(normalized)) valid.add(normalized);
  };

  const bracketMatches = answer.matchAll(/\[\s*([cC]?\s*\d+)\s*\]/g);
  for (const match of bracketMatches) {
    if (match[1]) registerId(match[1]);
  }

  const bareMatches = answer.matchAll(/\b[cC]\s*(\d+)\b/g);
  for (const match of bareMatches) {
    if (match[1]) registerId(`C${match[1]}`);
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
    message.includes('too many requests') ||
    message.includes('credit balance is too low')
  );
}

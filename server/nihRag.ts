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

const defaultTopK = Number(process.env.NIH_TOP_K ?? 10);
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
const runtimeChunkWords = Number(process.env.NIH_RUNTIME_CHUNK_WORDS ?? 240);
const runtimeChunkOverlapWords = Number(process.env.NIH_RUNTIME_CHUNK_OVERLAP_WORDS ?? 60);
const typoMaxEditDistance = Number(process.env.NIH_TYPO_MAX_EDIT_DISTANCE ?? 2);
const lexiconMaxTerms = Number(process.env.NIH_LEXICON_MAX_TERMS ?? 15000);

let lexiconTerms: string[] = [];
let lexiconSet = new Set<string>();
let lexiconFrequency = new Map<string, number>();

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'in', 'is', 'it',
  'of', 'on', 'or', 'that', 'the', 'this', 'to', 'what', 'when', 'where', 'which', 'who',
  'why', 'with', 'main', 'about', 'does', 'your',
  'can', 'could', 'would', 'should', 'there', 'their', 'them', 'they', 'you', 'please',
  'tell', 'say', 'says', 'mean', 'means', 'into', 'have', 'has', 'had', 'more', 'less',
  'than', 'then', 'also', 'just', 'like', 'uh', 'um', 'hmm', 'okay', 'ok',
]);

const COMMON_TYPO_MAP = new Map<string, string>([
  ['fpdmap', 'fodmap'],
  ['fodmop', 'fodmap'],
  ['fodpam', 'fodmap'],
  ['lactoluse', 'lactulose'],
  ['methan', 'methane'],
  ['siboo', 'sibo'],
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNihEvidenceUrl(value: string): boolean {
  const raw = String(value ?? '').trim();
  if (!raw) return false;

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();
    return host === 'nih.gov' || host.endsWith('.nih.gov');
  } catch {
    return false;
  }
}

function tokenize(value: string): string[] {
  const terms = normalizeText(value)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  const uniqueTerms = new Set<string>();
  for (const term of terms) uniqueTerms.add(term);
  return [...uniqueTerms];
}

function buildTypoLexicon(chunks: ChunkRecord[]) {
  const frequency = new Map<string, number>();
  for (const chunk of chunks) {
    const tokens = normalizeText(`${chunk.title} ${chunk.content}`).split(' ');
    for (const token of tokens) {
      if (token.length < 4 || token.length > 24) continue;
      if (STOP_WORDS.has(token)) continue;
      if (!/[a-z]/.test(token)) continue;
      if (/^\d+$/.test(token)) continue;
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }

  const maxTerms = Number.isFinite(lexiconMaxTerms) && lexiconMaxTerms > 1000
    ? Math.floor(lexiconMaxTerms)
    : 15000;
  const sorted = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTerms);

  lexiconTerms = sorted.map(([term]) => term);
  lexiconSet = new Set(lexiconTerms);
  lexiconFrequency = new Map(sorted);
}

function levenshteinWithin(a: string, b: string, maxDistance: number): number {
  if (a === b) return 0;
  if (maxDistance < 0) return maxDistance + 1;
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

  let previous = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) previous[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array<number>(b.length + 1);
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const insertCost = current[j - 1] + 1;
      const deleteCost = previous[j] + 1;
      const replaceCost = previous[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1);
      current[j] = Math.min(insertCost, deleteCost, replaceCost);
      if (current[j] < rowMin) rowMin = current[j];
    }

    if (rowMin > maxDistance) return maxDistance + 1;
    previous = current;
  }

  return previous[b.length];
}

function resolveTypoToken(term: string): string | null {
  if (COMMON_TYPO_MAP.has(term)) return COMMON_TYPO_MAP.get(term) ?? null;
  if (term.length < 4 || term.length > 24) return null;
  if (lexiconSet.has(term)) return null;
  if (lexiconTerms.length === 0) return null;

  const maxDistance = Number.isFinite(typoMaxEditDistance) && typoMaxEditDistance >= 1
    ? Math.min(3, Math.floor(typoMaxEditDistance))
    : 2;
  let bestToken: string | null = null;
  let bestDistance = maxDistance + 1;
  let bestFrequency = -1;

  for (const candidate of lexiconTerms) {
    if (Math.abs(candidate.length - term.length) > maxDistance) continue;
    if (candidate[0] !== term[0]) continue;
    const distance = levenshteinWithin(term, candidate, bestDistance - 1);
    if (distance > maxDistance) continue;

    const frequency = lexiconFrequency.get(candidate) ?? 0;
    if (
      distance < bestDistance ||
      (distance === bestDistance && frequency > bestFrequency)
    ) {
      bestToken = candidate;
      bestDistance = distance;
      bestFrequency = frequency;
    }
  }

  if (!bestToken || STOP_WORDS.has(bestToken)) return null;
  return bestToken;
}

function expandTypoTerms(baseTerms: string[]): string[] {
  const expanded = new Set(baseTerms);
  for (const term of baseTerms) {
    const corrected = resolveTypoToken(term);
    if (corrected) expanded.add(corrected);
  }
  return [...expanded];
}

function buildLunrQuery(terms: string[]): string {
  const parts: string[] = [];
  for (const term of terms) {
    parts.push(`${term}*`);
    if (term.length >= 5) parts.push(`${term}~1`);
  }
  return parts.join(' ');
}

function sanitizeKnowledgeText(value: string): string {
  return value
    .replace(/\s*>>\s*/g, ' ')
    .replace(/\b(uh|um)\b/gi, ' ')
    .replace(/\b(you know|kind of|sort of)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function rechunkDocument(chunks: string[], maxWords = runtimeChunkWords, overlapWords = runtimeChunkOverlapWords): string[] {
  const safeMaxWords = Number.isFinite(maxWords) && maxWords >= 80 ? Math.floor(maxWords) : 240;
  const safeOverlap = Number.isFinite(overlapWords) && overlapWords >= 0
    ? Math.min(Math.floor(overlapWords), safeMaxWords - 20)
    : 60;
  const step = Math.max(20, safeMaxWords - safeOverlap);

  const rawText = chunks
    .map((chunk) => sanitizeKnowledgeText(String(chunk ?? '')))
    .filter(Boolean)
    .join(' ');
  const words = rawText.split(/\s+/).filter(Boolean);

  if (words.length === 0) return [];
  if (words.length <= safeMaxWords) return [words.join(' ')];

  const result: string[] = [];
  for (let start = 0; start < words.length; start += step) {
    const slice = words.slice(start, start + safeMaxWords);
    if (slice.length === 0) break;
    result.push(slice.join(' '));
    if (start + safeMaxWords >= words.length) break;
  }

  return result;
}

function expandDomainTerms(baseTerms: string[]): string[] {
  const expanded = new Set(baseTerms);
  const hasSibo = expanded.has('sibo');
  const asksForTypes = expanded.has('type') || expanded.has('types');
  const asksForThree = expanded.has('three') || expanded.has('3');

  if (hasSibo && (asksForTypes || asksForThree)) {
    for (const term of ['hydrogen', 'methane', 'sulfide', 'h2s', 'imo', 'emo', 'gas']) {
      expanded.add(term);
    }
  }

  return [...expanded];
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
      const sourceUrl = String(doc.url ?? '').trim();
      if (!isNihEvidenceUrl(sourceUrl)) {
        console.warn(`[NIH_CACHE_SKIP_NON_NIH] ${fileName}: ${sourceUrl || 'missing-url'}`);
        continue;
      }
      const rechunked = rechunkDocument(doc.chunks);
      if (rechunked.length === 0) continue;

      rechunked.forEach((chunk, chunkIndex) => {
        const content = sanitizeKnowledgeText(String(chunk ?? ''));
        if (!content) return;
        rows.push({
          id: `${fileName}::${chunkIndex}`,
          title: String(doc.title ?? doc.url ?? 'NIH source'),
          url: sourceUrl,
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

  buildTypoLexicon(cachedChunks);
}

function keywordStats(chunk: ChunkRecord, queryTerms: string[]) {
  if (queryTerms.length === 0) return {score: 0, matchedTerms: 0};
  const text = normalizeText(`${chunk.title} ${chunk.content}`);
  const title = normalizeText(chunk.title);
  let score = 0;
  let matchedTerms = 0;
  for (const term of queryTerms) {
    if (!text.includes(term)) continue;
    matchedTerms += 1;
    score += 1;
    if (title.includes(term)) score += 1.5;
  }
  return {score, matchedTerms};
}

function combinedScore(item: {lunrScore: number; keyword: number; matchedTerms: number}) {
  return (item.lunrScore * 2.2) + item.keyword + (item.matchedTerms * 0.9);
}

function countContainedTerms(text: string, terms: string[]): number {
  let count = 0;
  for (const term of terms) {
    if (text.includes(term)) count += 1;
  }
  return count;
}

function requiredTermMatches(queryTerms: string[]): number {
  if (queryTerms.length <= 1) return 1;
  if (queryTerms.length <= 3) return 2;
  if (queryTerms.length <= 7) return 2;
  return 3;
}

export function retrieveNihCitations(question: string, topK = defaultTopK): NihCitation[] {
  ensureIndex();
  if (!index || cachedChunks.length === 0) return [];

  const queryTerms = expandDomainTerms(expandTypoTerms(tokenize(question)));
  if (queryTerms.length === 0) return [];

  const scored = new Map<string, {chunk: ChunkRecord; lunrScore: number; keyword: number; matchedTerms: number}>();

  try {
    const lunrQuery = buildLunrQuery(queryTerms);
    const lunrHits = index.search(lunrQuery).slice(0, Math.max(25, topK * 4));
    for (const hit of lunrHits) {
      const chunk = cachedChunks.find((item) => item.id === hit.ref);
      if (!chunk) continue;
      const stats = keywordStats(chunk, queryTerms);
      scored.set(chunk.id, {
        chunk,
        lunrScore: hit.score,
        keyword: stats.score,
        matchedTerms: stats.matchedTerms,
      });
    }
  } catch {
    // If lunr query parser fails, we still use keyword-only ranking.
  }

  for (const chunk of cachedChunks) {
    if (scored.has(chunk.id)) continue;
    const stats = keywordStats(chunk, queryTerms);
    if (stats.score <= 0) continue;
    scored.set(chunk.id, {
      chunk,
      lunrScore: 0,
      keyword: stats.score,
      matchedTerms: stats.matchedTerms,
    });
  }

  const asksForSiboTypes = queryTerms.includes('sibo') && (
    queryTerms.includes('type') ||
    queryTerms.includes('types') ||
    queryTerms.includes('three') ||
    queryTerms.includes('3')
  );

  const rankedCandidates = [...scored.values()];
  const gasFocusedCandidates = asksForSiboTypes
    ? rankedCandidates.filter((item) => {
        const text = normalizeText(`${item.chunk.title} ${item.chunk.content}`);
        return countContainedTerms(text, ['hydrogen', 'methane', 'sulfide']) >= 2;
      })
    : [];

  const basePool = gasFocusedCandidates.length > 0 ? gasFocusedCandidates : rankedCandidates;
  const minMatches = requiredTermMatches(queryTerms);
  const filteredByCoverage = basePool.filter((item) => item.matchedTerms >= minMatches);
  if (filteredByCoverage.length === 0) return [];
  const pool = filteredByCoverage;

  const ranked = pool
    .sort((a, b) => combinedScore(b) - combinedScore(a))
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
        'If context is insufficient, say so explicitly and do not invent missing facts.',
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
    'For "types of SIBO" questions, explicitly check for hydrogen, methane (IMO/EMO), and hydrogen sulfide mentions before concluding anything is missing.',
    'If the question asks for a count (e.g., "three types"), return that exact count when supported by context and map methane-predominant overgrowth to IMO/EMO terminology.',
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

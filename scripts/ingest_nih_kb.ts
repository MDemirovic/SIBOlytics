import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES_FILE = path.join(__dirname, '../src/nih_kb/sources.json');
const CACHE_DIR = path.join(__dirname, '../src/nih_kb/cache');

interface Source {
  url: string;
  title: string;
  category: string;
}

interface CachedDoc {
  url: string;
  title: string;
  dateFetched: string;
  chunks: string[];
}

const chunkText = (text: string, maxWords = 150): string[] => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }
  return chunks;
};

const looksLikeNotFoundPage = (text: string): boolean => {
  const probe = text.slice(0, 1200).toLowerCase();
  return (
    probe.includes('page not found') ||
    probe.includes('404') ||
    probe.includes('cannot be found')
  );
};

const ingest = async () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const sourcesData = fs.readFileSync(SOURCES_FILE, 'utf-8');
  const sources: Source[] = JSON.parse(sourcesData);

  for (const source of sources) {
    if (!source.url.includes('.nih.gov')) {
      console.warn(`Skipping non-NIH source: ${source.url}`);
      continue;
    }

    try {
      console.log(`Fetching ${source.url}...`);
      const response = await fetch(source.url);
      const filename = source.url.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json';
      const outputPath = path.join(CACHE_DIR, filename);

      if (!response.ok) {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove scripts, styles, nav, footer
      $('script, style, nav, footer, header, aside, iframe, noscript').remove();
      
      // Extract main text with a few common containers before falling back to body.
      const extracted =
        $('main').text() ||
        $('article').text() ||
        $('[role="main"]').text() ||
        $('body').text();
      const text = extracted.replace(/\s+/g, ' ').trim();

      if (!text || text.length < 500 || looksLikeNotFoundPage(text)) {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        throw new Error(`Extracted page content looks invalid/404 for ${source.url}`);
      }
      
      const chunks = chunkText(text);
      
      const cachedDoc: CachedDoc = {
        url: source.url,
        title: source.title,
        dateFetched: new Date().toISOString(),
        chunks
      };

      fs.writeFileSync(outputPath, JSON.stringify(cachedDoc, null, 2));
      console.log(`Saved ${chunks.length} chunks for ${source.title}`);
    } catch (error) {
      console.error(`Failed to ingest ${source.url}:`, error);
    }
  }
  
  console.log('Ingestion complete.');
};

ingest();

import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

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
      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove scripts, styles, nav, footer
      $('script, style, nav, footer, header, aside').remove();
      
      // Extract main text (very basic heuristic)
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      
      const chunks = chunkText(text);
      
      const cachedDoc: CachedDoc = {
        url: source.url,
        title: source.title,
        dateFetched: new Date().toISOString(),
        chunks
      };

      const filename = source.url.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json';
      fs.writeFileSync(path.join(CACHE_DIR, filename), JSON.stringify(cachedDoc, null, 2));
      console.log(`Saved ${chunks.length} chunks for ${source.title}`);
    } catch (error) {
      console.error(`Failed to ingest ${source.url}:`, error);
    }
  }
  
  console.log('Ingestion complete.');
};

ingest();

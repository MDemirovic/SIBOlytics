import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import Papa from 'papaparse';
import { BreathDataPoint } from '../types/breathTest';

// Set up PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export interface ParseResult {
  success: boolean;
  data: BreathDataPoint[];
  message?: string;
}

const MIN_REQUIRED_POINTS = 2;
const MAX_MINUTE = 360;
const MAX_GAS_PPM = 500;
const SUBSCRIPT_DIGIT_MAP: Record<string, string> = {
  '\u2080': '0',
  '\u2081': '1',
  '\u2082': '2',
  '\u2083': '3',
  '\u2084': '4',
  '\u2085': '5',
  '\u2086': '6',
  '\u2087': '7',
  '\u2088': '8',
  '\u2089': '9',
};

const normalizeHeader = (header: string): string => {
  const withDigits = header.replace(/[\u2080-\u2089]/g, (char) => SUBSCRIPT_DIGIT_MAP[char] ?? char);
  return withDigits
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

const parseNumberish = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') return null;

  const cleaned = value
    .replace(/,/g, '.')
    .replace(/[^0-9.\-]/g, '')
    .trim();

  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const toBreathDataPoint = (minute: number, h2: number, ch4: number): BreathDataPoint | null => {
  const minuteRounded = Math.round(minute);
  const h2Rounded = Math.round(h2);
  const ch4Rounded = Math.round(ch4);

  if (Math.abs(minuteRounded - minute) > 0.001) return null;
  if (minuteRounded < 0 || minuteRounded > MAX_MINUTE) return null;
  if (h2Rounded < 0 || h2Rounded > MAX_GAS_PPM) return null;
  if (ch4Rounded < 0 || ch4Rounded > MAX_GAS_PPM) return null;

  return {
    minute: minuteRounded,
    h2: h2Rounded,
    ch4: ch4Rounded,
  };
};

const dedupeAndSort = (points: BreathDataPoint[]): BreathDataPoint[] => {
  const byMinute = new Map<number, BreathDataPoint>();

  for (const point of points) {
    if (!byMinute.has(point.minute)) {
      byMinute.set(point.minute, point);
    }
  }

  return [...byMinute.values()].sort((a, b) => a.minute - b.minute);
};

const pickPointFromNumericValues = (values: number[]): BreathDataPoint | null => {
  if (values.length < 3) return null;

  for (let i = 0; i <= values.length - 3; i += 1) {
    const point = toBreathDataPoint(values[i], values[i + 1], values[i + 2]);
    if (point) return point;
  }

  return null;
};

const parseTextToDataPoints = (text: string): BreathDataPoint[] => {
  const lines = text.split(/\r?\n/);
  const points: BreathDataPoint[] = [];

  for (const line of lines) {
    const cleanLine = line.replace(/\s+/g, ' ').trim();
    if (!cleanLine) continue;

    const numericMatches = cleanLine.match(/-?\d+(?:[.,]\d+)?/g);
    if (!numericMatches || numericMatches.length < 3) continue;

    const numericValues = numericMatches
      .map((token) => parseNumberish(token))
      .filter((value): value is number => value !== null);

    const point = pickPointFromNumericValues(numericValues);
    if (point) {
      points.push(point);
    }
  }

  return dedupeAndSort(points);
};

const parseRowsWithHeader = (rows: Record<string, unknown>[]): BreathDataPoint[] => {
  const firstRow = rows.find((row) => row && typeof row === 'object');
  if (!firstRow) return [];

  const keys = Object.keys(firstRow);
  if (keys.length === 0) return [];

  const minuteKey = keys.find((key) => {
    const normalized = normalizeHeader(key);
    return normalized.includes('minute') || normalized === 'min' || normalized === 'time';
  });
  const h2Key = keys.find((key) => {
    const normalized = normalizeHeader(key);
    return normalized.includes('h2') || normalized.includes('hydrogen');
  });
  const ch4Key = keys.find((key) => {
    const normalized = normalizeHeader(key);
    return normalized.includes('ch4') || normalized.includes('methane');
  });

  if (!minuteKey || !h2Key || !ch4Key) return [];

  const points: BreathDataPoint[] = [];

  for (const row of rows) {
    const minute = parseNumberish(row[minuteKey]);
    const h2 = parseNumberish(row[h2Key]);
    const ch4 = parseNumberish(row[ch4Key]);
    if (minute === null || h2 === null || ch4 === null) continue;

    const point = toBreathDataPoint(minute, h2, ch4);
    if (point) {
      points.push(point);
    }
  }

  return dedupeAndSort(points);
};

const parseRowsWithoutHeader = (rows: unknown[]): BreathDataPoint[] => {
  const points: BreathDataPoint[] = [];

  for (const row of rows) {
    if (!Array.isArray(row)) continue;

    const numericValues = row
      .map((cell) => parseNumberish(cell))
      .filter((value): value is number => value !== null);

    const point = pickPointFromNumericValues(numericValues);
    if (point) {
      points.push(point);
    }
  }

  return dedupeAndSort(points);
};

export const parseCSV = async (file: File): Promise<ParseResult> => {
  try {
    const csvText = await file.text();

    const withHeader = Papa.parse<Record<string, unknown>>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
    const withHeaderPoints = parseRowsWithHeader(withHeader.data);
    if (withHeaderPoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: withHeaderPoints };
    }

    const withoutHeader = Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
    const withoutHeaderPoints = parseRowsWithoutHeader(withoutHeader.data as unknown[]);
    if (withoutHeaderPoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: withoutHeaderPoints };
    }

    const loosePoints = parseTextToDataPoints(csvText);
    if (loosePoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: loosePoints };
    }

    return { success: false, data: [], message: "Could not find minute, h2, and ch4 columns in CSV." };
  } catch (error) {
    console.error('CSV parsing failed:', error);
    return { success: false, data: [], message: "Failed to parse CSV file." };
  }
};

export const parseImage = async (file: File): Promise<ParseResult> => {
  try {
    const result = await Tesseract.recognize(file, 'eng');
    const text = result.data.text;
    const dataPoints = parseTextToDataPoints(text);
    
    if (dataPoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: dataPoints };
    }
    return { success: false, data: [], message: "Could not reliably extract values from image." };
  } catch (error) {
    console.error('Image OCR failed:', error);
    return { success: false, data: [], message: "OCR processing failed." };
  }
};

const extractPdfText = async (pdf: any): Promise<string> => {
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `${pageText}\n`;
  }

  return fullText;
};

const extractPdfTextWithOcr = async (pdf: any): Promise<string> => {
  if (typeof document === 'undefined') return '';

  let fullText = '';
  const pagesToScan = Math.min(pdf.numPages, 5);

  for (let i = 1; i <= pagesToScan; i += 1) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const context = canvas.getContext('2d');
    if (!context) continue;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const ocrResult = await Tesseract.recognize(canvas, 'eng');
    fullText += `${ocrResult.data.text}\n`;

    canvas.width = 0;
    canvas.height = 0;
  }

  return fullText;
};

export const parsePDF = async (file: File): Promise<ParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const extractedText = await extractPdfText(pdf);
    const extractedPoints = parseTextToDataPoints(extractedText);

    if (extractedPoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: extractedPoints };
    }

    const ocrText = await extractPdfTextWithOcr(pdf);
    const ocrPoints = parseTextToDataPoints(ocrText);

    if (ocrPoints.length >= MIN_REQUIRED_POINTS) {
      return { success: true, data: ocrPoints };
    }

    return { success: false, data: [], message: "Could not reliably extract values from PDF." };
  } catch (error) {
    console.error('PDF parsing failed:', error);
    return { success: false, data: [], message: "PDF processing failed." };
  }
};

export const processFile = async (file: File): Promise<ParseResult> => {
  const type = file.type;
  const name = file.name.toLowerCase();
  
  if (type === 'text/csv' || name.endsWith('.csv')) {
    return parseCSV(file);
  } else if (type.startsWith('image/')) {
    return parseImage(file);
  } else if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return parsePDF(file);
  }
  
  return { success: false, data: [], message: "Unsupported file format." };
};

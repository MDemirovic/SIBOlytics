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

const parseTextToDataPoints = (text: string): BreathDataPoint[] => {
  const lines = text.split('\n');
  const dataPoints: BreathDataPoint[] = [];
  
  // Look for common timepoints: 0, 15, 30, 45, 60, 90, 120, 150, 180
  const expectedMinutes = [0, 15, 20, 30, 40, 45, 60, 80, 90, 100, 120, 140, 150, 160, 180];
  
  // Very basic heuristic: look for lines that start with a number (minute) followed by other numbers
  for (const line of lines) {
    // Replace multiple spaces/tabs with single space
    const cleanLine = line.replace(/\s+/g, ' ').trim();
    const parts = cleanLine.split(' ');
    
    if (parts.length >= 3) {
      const min = parseInt(parts[0], 10);
      const h2 = parseInt(parts[1], 10);
      const ch4 = parseInt(parts[2], 10);
      
      if (!isNaN(min) && !isNaN(h2) && !isNaN(ch4) && expectedMinutes.includes(min)) {
        // Avoid duplicates
        if (!dataPoints.find(dp => dp.minute === min)) {
          dataPoints.push({ minute: min, h2, ch4 });
        }
      }
    }
  }
  
  return dataPoints.sort((a, b) => a.minute - b.minute);
};

export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const dataPoints: BreathDataPoint[] = [];
        for (const row of results.data as any[]) {
          // Try to find minute, h2, ch4 columns (case insensitive)
          const keys = Object.keys(row);
          const minKey = keys.find(k => k.toLowerCase().includes('min') || k.toLowerCase().includes('time'));
          const h2Key = keys.find(k => k.toLowerCase().includes('h2') || k.toLowerCase().includes('hydrogen'));
          const ch4Key = keys.find(k => k.toLowerCase().includes('ch4') || k.toLowerCase().includes('methane'));
          
          if (minKey && h2Key && ch4Key) {
            const min = parseInt(row[minKey], 10);
            const h2 = parseInt(row[h2Key], 10);
            const ch4 = parseInt(row[ch4Key], 10);
            
            if (!isNaN(min) && !isNaN(h2) && !isNaN(ch4)) {
              dataPoints.push({ minute: min, h2, ch4 });
            }
          }
        }
        
        if (dataPoints.length > 0) {
          resolve({ success: true, data: dataPoints.sort((a, b) => a.minute - b.minute) });
        } else {
          resolve({ success: false, data: [], message: "Could not find minute, h2, and ch4 columns in CSV." });
        }
      },
      error: () => {
        resolve({ success: false, data: [], message: "Failed to parse CSV file." });
      }
    });
  });
};

export const parseImage = async (file: File): Promise<ParseResult> => {
  try {
    const result = await Tesseract.recognize(file, 'eng');
    const text = result.data.text;
    const dataPoints = parseTextToDataPoints(text);
    
    if (dataPoints.length > 0) {
      return { success: true, data: dataPoints };
    }
    return { success: false, data: [], message: "Could not reliably extract values from image." };
  } catch (error) {
    return { success: false, data: [], message: "OCR processing failed." };
  }
};

export const parsePDF = async (file: File): Promise<ParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    const dataPoints = parseTextToDataPoints(fullText);
    
    if (dataPoints.length > 0) {
      return { success: true, data: dataPoints };
    }
    return { success: false, data: [], message: "Could not reliably extract values from PDF." };
  } catch (error) {
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

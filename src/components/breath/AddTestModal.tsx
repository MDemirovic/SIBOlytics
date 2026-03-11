import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { ApiRequestError, extractBreathTestFromImage } from '../../services/healthApi';
import { BreathDataPointDraft, BreathTest } from '../../types/breathTest';
import UploadDropzone from './UploadDropzone';
import ManualEntryTable from './ManualEntryTable';
import { useLanguage } from '../../context/LanguageContext';

interface AddTestModalProps {
  onClose: () => void;
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => Promise<void>;
}

const isImageForMistral = (file: File): file is File & { type: 'image/png' | 'image/jpeg' } => {
  const type = file.type.toLowerCase();
  return type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg';
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Could not read file as base64.'));
        return;
      }

      const commaIndex = reader.result.indexOf(',');
      if (commaIndex < 0) {
        reject(new Error('Invalid base64 file format.'));
        return;
      }

      resolve(reader.result.slice(commaIndex + 1));
    };

    reader.readAsDataURL(file);
  });
};

export default function AddTestModal({ onClose, onSave }: AddTestModalProps) {
  const { isHr } = useLanguage();
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<BreathDataPointDraft[] | null>(null);
  const [detectedInterval, setDetectedInterval] = useState<15 | 20 | null>(null);
  const [extractionWarnings, setExtractionWarnings] = useState<string[]>([]);

  const copy = {
    title: isHr ? 'Dodaj izdisajni test' : 'Add Breath Test',
    uploadTab: isHr ? 'Ucitaj datoteku' : 'Upload File',
    manualTab: isHr ? 'Rucni unos' : 'Manual Entry',
    extractingTitle: isHr ? 'Izdvajanje podataka...' : 'Extracting Data...',
    extractingBody: isHr ? 'AI cita rezultate tvog testa.' : 'Using AI to read your test results.',
    supported: isHr
      ? 'Podrzano: CSV/PDF parser i AI OCR za PNG/JPG.'
      : 'Supported: CSV/PDF parser and AI OCR for PNG/JPG.',
    reviewExtracted: isHr
      ? 'Podaci su izdvojeni. Molimo pregledaj i ispravi prije spremanja.'
      : 'Data extracted. Please review and correct before saving.',
    genericManualFallback: isHr
      ? 'Nije moguce pouzdano izdvojiti podatke. Unesi rucno.'
      : 'Could not reliably extract data. Please enter manually.',
    genericProcessingError: isHr
      ? 'Doslo je do greske tijekom obrade. Koristi rucni unos.'
      : 'An error occurred during processing. Please use Manual Entry.',
    unsupportedImageType: isHr
      ? 'Za AI OCR podrzani su samo PNG i JPG.'
      : 'AI OCR currently supports only PNG and JPG images.',
    imageTooLarge: isHr
      ? 'Slika je prevelika za OCR. Pokusaj manju sliku.'
      : 'Image is too large for OCR. Please try a smaller image.',
    ocrRateLimit: isHr
      ? 'OCR limit je dosegnut. Pokusaj kasnije.'
      : 'OCR limit reached. Please try again later.',
    ocrTimeout: isHr
      ? 'OCR je istekao. Pokusaj opet sa jasnijom slikom.'
      : 'OCR timed out. Please try again with a clearer image.',
  };

  const mapParserMessage = (message?: string): string => {
    if (!message) return copy.genericManualFallback;
    if (!isHr) return message;

    const messageMap: Record<string, string> = {
      'Could not find minute, h2, and ch4 columns in CSV.': 'Nisu pronadeni stupci minute, h2 i ch4 u CSV datoteci.',
      'Failed to parse CSV file.': 'Neuspjesno citanje CSV datoteke.',
      'Could not reliably extract values from PDF.': 'Nije moguce pouzdano izdvojiti vrijednosti iz PDF-a.',
      'PDF processing failed.': 'Obrada PDF-a nije uspjela.',
      'Unsupported file format.': 'Nepodrzan format datoteke.',
    };

    return messageMap[message] ?? copy.genericManualFallback;
  };

  const mapOcrApiError = (error: unknown): string => {
    if (error instanceof ApiRequestError) {
      if (error.code === 'UNSUPPORTED_FILE_TYPE') return copy.unsupportedImageType;
      if (error.code === 'FILE_TOO_LARGE') return copy.imageTooLarge;
      if (error.code === 'OCR_RATE_LIMIT') return copy.ocrRateLimit;
      if (error.code === 'OCR_TIMEOUT') return copy.ocrTimeout;
      if (error.message) return error.message;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return copy.genericProcessingError;
  };

  const handleImageUpload = async (file: File) => {
    if (!isImageForMistral(file)) {
      setOcrError(copy.unsupportedImageType);
      setMode('manual');
      return;
    }

    const base64 = await fileToBase64(file);
    const result = await extractBreathTestFromImage({
      fileName: file.name,
      mimeType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
      imageBase64: base64,
    });

    setExtractedData(
      result.rows.map((row) => ({
        minute: row.minute,
        h2: row.h2,
        ch4: row.ch4,
      }))
    );
    setDetectedInterval(result.detectedInterval);
    setExtractionWarnings(result.warnings ?? []);
    setMode('manual');
  };

  const handleStructuredFileUpload = async (file: File) => {
    const { processFile } = await import('../../utils/fileParser');
    const result = await processFile(file);

    if (result.success && result.data.length > 0) {
      setExtractedData(
        result.data.map((row) => ({
          minute: row.minute,
          h2: row.h2,
          ch4: row.ch4,
        }))
      );
      setDetectedInterval(null);
      setExtractionWarnings([]);
      setMode('manual');
      return;
    }

    setOcrError(mapParserMessage(result.message));
    setMode('manual');
  };

  const handleUpload = async (file: File) => {
    setOcrError(null);
    setIsExtracting(true);

    try {
      if (file.type.startsWith('image/')) {
        await handleImageUpload(file);
      } else {
        await handleStructuredFileUpload(file);
      }
    } catch (error) {
      setOcrError(mapOcrApiError(error));
      setMode('manual');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-6 pt-4 shrink-0">
          <div className="flex bg-slate-950 rounded-lg p-1 w-full border border-slate-800">
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === 'upload' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {copy.uploadTab}
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === 'manual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {copy.manualTab}
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {ocrError && (
            <div className="mb-6 flex items-start gap-3 text-sm text-amber-400 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{ocrError}</p>
            </div>
          )}

          {mode === 'upload' ? (
            <div className="space-y-4">
              {isExtracting ? (
                <div className="border-2 border-dashed border-slate-700 bg-slate-900/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">{copy.extractingTitle}</h3>
                  <p className="text-sm text-slate-400">{copy.extractingBody}</p>
                </div>
              ) : (
                <UploadDropzone onUpload={handleUpload} />
              )}
              <div className="text-xs text-slate-500 text-center mt-4">{copy.supported}</div>
            </div>
          ) : (
            <div>
              {extractedData && !ocrError && (
                <div className="mb-4 flex items-start gap-2 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{copy.reviewExtracted}</p>
                </div>
              )}
              <ManualEntryTable
                initialData={extractedData}
                minuteStep={detectedInterval}
                extractionWarnings={extractionWarnings}
                onSave={onSave}
                onCancel={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

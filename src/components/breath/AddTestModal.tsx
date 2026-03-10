import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { BreathTest, BreathDataPoint } from '../../types/breathTest';
import UploadDropzone from './UploadDropzone';
import ManualEntryTable from './ManualEntryTable';
import { useLanguage } from '../../context/LanguageContext';

interface AddTestModalProps {
  onClose: () => void;
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => Promise<void>;
}

export default function AddTestModal({ onClose, onSave }: AddTestModalProps) {
  const { isHr } = useLanguage();
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  
  // Pre-fill data for manual entry if extracted
  const [extractedData, setExtractedData] = useState<BreathDataPoint[] | null>(null);

  const copy = {
    title: isHr ? 'Dodaj izdisajni test' : 'Add Breath Test',
    uploadTab: isHr ? 'Učitaj datoteku' : 'Upload File',
    manualTab: isHr ? 'Ručni unos' : 'Manual Entry',
    extractingTitle: isHr ? 'Izdvajanje podataka...' : 'Extracting Data...',
    extractingBody: isHr ? 'AI čita rezultate tvog testa.' : 'Using AI to read your test results.',
    supported: isHr ? 'Podržano: CSV (minute, h2, ch4), PNG, JPG, PDF.' : 'Supported: CSV (minute, h2, ch4), PNG, JPG, PDF.',
    reviewExtracted: isHr
      ? 'Podaci su uspješno izdvojeni. Molimo provjeri i ispravi eventualne greške prije spremanja.'
      : 'Data extracted successfully. Please review and correct any errors before saving.',
    genericManualFallback: isHr
      ? 'Nije moguće pouzdano izdvojiti podatke. Molimo unesi ručno.'
      : 'Could not reliably extract data. Please enter manually.',
    genericProcessingError: isHr
      ? 'Došlo je do greške tijekom obrade. Molimo koristi ručni unos.'
      : 'An error occurred during processing. Please use Manual Entry.',
  };

  const mapParserMessage = (message?: string): string => {
    if (!message) return copy.genericManualFallback;
    if (!isHr) return message;
    const messageMap: Record<string, string> = {
      'Could not find minute, h2, and ch4 columns in CSV.': 'Nisu pronađeni stupci minute, h2 i ch4 u CSV datoteci.',
      'Failed to parse CSV file.': 'Neuspješno čitanje CSV datoteke.',
      'Could not reliably extract values from image.': 'Nije moguće pouzdano izdvojiti vrijednosti sa slike.',
      'OCR processing failed.': 'OCR obrada nije uspjela.',
      'Could not reliably extract values from PDF.': 'Nije moguće pouzdano izdvojiti vrijednosti iz PDF-a.',
      'PDF processing failed.': 'Obrada PDF-a nije uspjela.',
      'Unsupported file format.': 'Nepodržan format datoteke.',
    };
    return messageMap[message] ?? copy.genericManualFallback;
  };

  const handleUpload = async (file: File) => {
    setOcrError(null);
    setIsExtracting(true);
    
    try {
      const { processFile } = await import('../../utils/fileParser');
      const result = await processFile(file);
      if (result.success && result.data.length > 0) {
        setExtractedData(result.data);
        setMode('manual'); // Switch to manual for review
      } else {
        setOcrError(mapParserMessage(result.message));
        setMode('manual');
      }
    } catch {
      setOcrError(copy.genericProcessingError);
      setMode('manual');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 shrink-0">
          <div className="flex bg-slate-950 rounded-lg p-1 w-full border border-slate-800">
            <button 
              onClick={() => setMode('upload')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${mode === 'upload' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {copy.uploadTab}
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${mode === 'manual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {copy.manualTab}
            </button>
          </div>
        </div>

        {/* Body (Scrollable) */}
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
              <div className="text-xs text-slate-500 text-center mt-4">
                {copy.supported}
              </div>
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

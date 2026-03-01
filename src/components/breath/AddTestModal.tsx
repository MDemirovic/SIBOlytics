import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { BreathTest, BreathDataPoint } from '../../types/breathTest';
import UploadDropzone from './UploadDropzone';
import ManualEntryTable from './ManualEntryTable';

interface AddTestModalProps {
  onClose: () => void;
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => void;
}

export default function AddTestModal({ onClose, onSave }: AddTestModalProps) {
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  
  // Pre-fill data for manual entry if extracted
  const [extractedData, setExtractedData] = useState<BreathDataPoint[] | null>(null);

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
        setOcrError(result.message || 'Could not reliably extract data. Please enter manually.');
        setMode('manual');
      }
    } catch (error) {
      setOcrError('An error occurred during processing. Please use Manual Entry.');
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
          <h2 className="text-xl font-semibold text-white">Add Breath Test</h2>
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
              Upload File
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${mode === 'manual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Manual Entry
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
                  <h3 className="text-lg font-medium text-white mb-2">Extracting Data...</h3>
                  <p className="text-sm text-slate-400">Using AI to read your test results.</p>
                </div>
              ) : (
                <UploadDropzone onUpload={handleUpload} />
              )}
              <div className="text-xs text-slate-500 text-center mt-4">
                Supported: CSV (minute, h2, ch4), PNG, JPG, PDF.
              </div>
            </div>
          ) : (
            <div>
              {extractedData && !ocrError && (
                <div className="mb-4 flex items-start gap-2 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Data extracted successfully. Please review and correct any errors before saving.</p>
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

import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface UploadDropzoneProps {
  onUpload: (file: File) => void;
}

export default function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const { isHr } = useLanguage();
  const [dragActive, setDragActive] = useState(false);

  const copy = {
    title: isHr ? 'Učitaj svoj izdisajni test' : 'Upload your Breath Test',
    description: isHr
      ? 'Povuci i ispusti nalaz ovdje ili klikni za odabir. Podržani su slike, PDF i CSV.'
      : 'Drag and drop your test report here, or click to browse. We support Images, PDFs, and CSV files.',
    browse: isHr ? 'Odaberi datoteke' : 'Browse Files',
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="w-10 h-10 text-slate-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">{copy.title}</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
        {copy.description}
      </p>
      
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
          <ImageIcon className="w-4 h-4" /> PNG, JPG
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
          <FileText className="w-4 h-4" /> PDF
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
          <FileSpreadsheet className="w-4 h-4" /> CSV
        </div>
      </div>

      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".png,.jpg,.jpeg,.webp,.pdf,.csv"
        onChange={handleChange}
      />
      <label 
        htmlFor="file-upload"
        className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
      >
        {copy.browse}
      </label>
    </div>
  );
}

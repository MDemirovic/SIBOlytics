import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { educationSections } from '../content/educationSections';
import { educationSectionsHr } from '../content/educationSectionsHr';
import { useLanguage } from '../context/LanguageContext';

export default function Education() {
  const { isHr } = useLanguage();
  const sections = useMemo(() => (isHr ? educationSectionsHr : educationSections), [isHr]);
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0].id);
  const [showMobileToc, setShowMobileToc] = useState(false);

  const copy = {
    title: isHr ? 'SIBO vodič' : 'SIBO Guide',
    subtitle: isHr
      ? 'Strukturirani edukativni pregled SIBO/IMO tema, temeljen na dostupnoj literaturi i konsenzusnim smjernicama.'
      : 'A structured, evidence-based overview of Small Intestinal Bacterial Overgrowth (SIBO) and related conditions based on Pimentel-led and consensus literature.',
    toc: isHr ? 'Sadržaj' : 'Table of Contents',
    contents: isHr ? 'Sadržaj' : 'Contents',
    sources: isHr ? 'Izvori i reference' : 'Sources & References',
    source1: isHr ? 'North American Consensus za izdisajno testiranje (2017)' : 'North American Consensus on Breath Testing (2017)',
    source2: isHr ? 'ACG smjernice: SIBO (2020)' : 'ACG Clinical Guideline: Small Intestinal Bacterial Overgrowth (2020)',
    source3: isHr ? 'Pimentel i sur. metan i tranzit crijeva (2006+)' : 'Pimentel et al. methane and gut transit data (2006+)',
    source4: isHr ? 'Predavanje Marka Pimentela (2026)' : 'Mark Pimentel lecture (2026)',
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const scrollToSection = (id: string) => {
    setExpandedSection(id);
    setShowMobileToc(false);

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-3xl font-semibold tracking-tight text-white">{copy.title}</h1>
        </div>
        <p className="text-slate-400 max-w-3xl">{copy.subtitle}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <button
          className="lg:hidden w-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-white font-medium"
          onClick={() => setShowMobileToc(!showMobileToc)}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> {copy.toc}
          </span>
          {showMobileToc ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <div className={`lg:w-1/3 shrink-0 lg:sticky lg:top-32 ${showMobileToc ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              {copy.contents}
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={`toc-${section.id}`}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    expandedSection === section.id
                      ? 'bg-blue-600/20 text-blue-400 font-medium'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:w-2/3 space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                id={section.id}
                className={`bg-slate-900/40 border rounded-2xl overflow-hidden transition-all duration-200 scroll-mt-32 ${
                  isExpanded ? 'border-blue-500/30 shadow-lg shadow-blue-900/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 bg-slate-950/30 hover:bg-slate-900/50 transition-colors"
                >
                  <div>
                    <h2 className={`text-lg font-medium mb-1 transition-colors ${isExpanded ? 'text-blue-400' : 'text-white'}`}>
                      {section.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">{section.summary}</p>
                  </div>
                  <div className={`p-1.5 rounded-full bg-slate-800/50 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 pt-2 border-t border-slate-800/50 bg-slate-900/20">
                    <ul className="space-y-3 mb-6">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                      <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>{section.evidenceNote}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-base font-medium text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              {copy.sources}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                {copy.source1}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                {copy.source2}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                {copy.source3}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                {copy.source4}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import type { ContentPart } from '../types';

interface SidebarProps {
  content: ContentPart[];
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ content, selectedChapterId, onSelectChapter }) => {
  return (
    <aside className="w-72 h-full bg-brand-dark/40 backdrop-blur-xl text-white flex flex-col shrink-0 border-r border-white/10 relative z-20">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-display font-bold text-brand-orange leading-none mb-1">AI Music Theory</h1>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Powered by</span>
          <span className="text-sm font-display font-bold text-white tracking-tight">SCHOOLCLASS.NET</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {content.map((part, partIndex) => (
          <div key={partIndex} className="mb-8">
            <h2 className="text-[10px] font-black uppercase text-brand-orange/70 mb-3 tracking-widest pl-2 border-l border-brand-orange/30">
              {part.partTitle}
            </h2>
            <ul className="space-y-1">
              {part.chapters.map(chapter => (
                <li key={chapter.id}>
                  <button
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      selectedChapterId === chapter.id
                        ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-900/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-all duration-300 ${
                         selectedChapterId === chapter.id ? 'bg-white scale-100' : 'bg-slate-600 scale-0 group-hover:scale-100'
                      }`}></span>
                      {chapter.title}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 bg-brand-dark/20">
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 border border-white/10">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Student Portal</p>
          <p className="text-xs text-white">Access all courses at <span className="text-brand-orange">schoolclass.net</span></p>
        </div>
      </div>
    </aside>
  );
};

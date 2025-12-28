
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { AiTutor } from './components/AiTutor';
import { ThreeScene } from './components/ThreeScene';
import { bookContent } from './constants';
import type { Chapter } from './types';

const App: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('part1-ch1');

  const handleSelectChapter = (id: string) => {
    setSelectedChapterId(id);
  };

  const currentChapter = useMemo((): Chapter | undefined => {
    for (const part of bookContent) {
      const foundChapter = part.chapters.find(ch => ch.id === selectedChapterId);
      if (foundChapter) return foundChapter;
    }
    return undefined;
  }, [selectedChapterId]);

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      <ThreeScene />
      
      <Sidebar 
        content={bookContent} 
        selectedChapterId={selectedChapterId} 
        onSelectChapter={handleSelectChapter} 
      />

      <main className="flex-1 overflow-y-auto z-10 bg-white/90 backdrop-blur-md shadow-inner">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm px-8 py-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <span className="text-brand-orange font-display font-bold text-xl">SCHOOLCLASS.NET</span>
             <span className="text-slate-300">|</span>
             <span className="text-slate-600 font-medium italic">Empowering Musical Minds</span>
          </div>
          <div className="text-xs text-brand-muted font-bold tracking-widest uppercase">
            Interactive Learning Experience
          </div>
        </header>

        <div className="min-h-full">
          {currentChapter ? (
            <ContentDisplay chapter={currentChapter} />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <h1 className="text-3xl font-bold font-display text-brand-dark mb-4">Select a Chapter</h1>
              <p className="text-brand-muted max-w-md">The world of music theory is waiting for you. Choose a lesson from the sidebar to begin your journey with SCHOOLCLASS.NET.</p>
            </div>
          )}
          
          <footer className="mt-12 py-12 px-8 border-t border-slate-100 bg-slate-50/50">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
              <h2 className="text-brand-dark font-display font-bold text-lg">SCHOOLCLASS.NET</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Dedicated to providing high-quality, accessible music education through innovative technology.
                This platform utilizes artificial intelligence to guide students through the complex world of musical notation, harmony, and rhythm.
              </p>
              <div className="text-xs font-semibold text-slate-400 pt-4 uppercase tracking-tighter">
                &copy; {new Date().getFullYear()} SCHOOLCLASS.NET. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </main>

      {currentChapter && <AiTutor chapterContext={currentChapter} />}
    </div>
  );
};

export default App;

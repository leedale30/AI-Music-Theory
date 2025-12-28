
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chapter, ContentItem } from '../types';
import { MusicNotation } from './MusicNotation';
import { Callout } from './Callout';

interface ContentDisplayProps {
  chapter: Chapter;
}

const AiImage: React.FC<{ prompt: string; caption: string }> = ({ prompt, caption }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (e) {
        console.error("Image generation failed", e);
      } finally {
        setLoading(false);
      }
    };
    generateImage();
  }, [prompt]);

  if (loading) return (
    <div className="my-8 aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center animate-pulse border border-slate-200">
      <div className="text-4xl mb-2">🎨</div>
      <p className="text-xs text-brand-muted font-bold uppercase tracking-widest">Generating AI Illustration...</p>
    </div>
  );

  return (
    <div className="my-8 group">
      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-slate-200 bg-white p-2 transition-all hover:shadow-2xl">
        {imageUrl ? (
          <img src={imageUrl} alt={caption} className="w-full h-auto rounded-xl grayscale hover:grayscale-0 transition-all duration-700" />
        ) : (
          <div className="p-8 text-center text-slate-400">Image failed to load</div>
        )}
        <div className="p-4">
          <p className="text-xs font-bold text-brand-dark uppercase tracking-widest mb-1">AI Illustration</p>
          <p className="text-sm text-brand-muted italic">{caption}</p>
        </div>
      </div>
    </div>
  );
};

const renderContentItem = (item: ContentItem, index: number) => {
  switch (item.type) {
    case 'heading1':
      return <h1 key={index} className="text-4xl font-bold font-serif text-brand-dark mb-6 mt-4 pb-2 border-b">{item.text}</h1>;
    case 'heading2':
      return <h2 key={index} className="text-2xl font-bold font-serif text-brand-dark mb-4 mt-8">{item.text}</h2>;
    case 'paragraph':
      return <p key={index} className="text-base text-slate-700 leading-relaxed mb-4">{item.text}</p>;
    case 'list':
      return <ul key={index} className="list-disc list-inside mb-4 pl-4 text-slate-700">
        {item.items.map((li, i) => <li key={i}>{li}</li>)}
      </ul>;
    case 'callout':
      return <Callout key={index} kind={item.kind} content={item.content} />;
    case 'notation':
      return <div key={index} className="my-6">
        <MusicNotation data={item.data} />
        {item.caption && <p className="text-center text-sm text-brand-muted mt-2 italic">{item.caption}</p>}
      </div>;
    case 'image':
      return <AiImage key={index} prompt={item.prompt} caption={item.caption} />;
    default:
      return null;
  }
};

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ chapter }) => {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="text-xs font-black text-brand-orange uppercase tracking-[0.3em]">SCHOOLCLASS.NET / CURRICULUM</span>
        <h1 className="text-5xl font-bold font-serif text-brand-dark mt-2 mb-6 leading-tight">{chapter.title}</h1>
        <div className="h-1 w-24 bg-brand-orange"></div>
      </div>
      {chapter.content.map(renderContentItem)}
    </article>
  );
};

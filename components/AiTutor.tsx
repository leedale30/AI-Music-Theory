
import React, { useState, useRef, useEffect } from 'react';
import { streamChat } from '../services/geminiService';
import { MusicNotation } from './MusicNotation';
import type { Chapter } from '../types';

interface AiTutorProps {
  chapterContext: Chapter;
}

interface Message {
  role: 'user' | 'model';
  parts: string;
}

const BASE_SYSTEM_INSTRUCTION = `You are a friendly and expert music theory tutor from SCHOOLCLASS.NET. 
Your knowledge is based on 'The Complete Idiot's Guide to Music Theory'. 
Explain concepts clearly and simply, like you're talking to a beginner. 
Keep your answers concise and encouraging. 

IMPORTANT: The student CANNOT read ABC notation. 
Whenever you provide a musical example (scales, chords, melodies), you MUST wrap the ABC notation in a code block tagged with 'abc'.
Format:
\`\`\`abc
X:1
K:C
C D E F
\`\`\`
The application will automatically render this as a visual staff for the student. Do not just write the notes as text; always provide the rendered notation block for clarity.`;

export const AiTutor: React.FC<AiTutorProps> = ({ chapterContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    setMessages([]);
  },[chapterContext])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Include only the last 10 messages to keep the context focused ("previous few")
    const historyContext = messages.slice(-10);

    // Enhance system instruction with current chapter context
    const dynamicSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}
    
CONTEXT: The user is currently reading Chapter "${chapterContext.title}".
Here is the content of the chapter in JSON format:
${JSON.stringify(chapterContext.content)}`;

    try {
      // Pass 'input' as the current prompt, historyContext as previous history, and dynamic system instruction
      const stream = streamChat(input, historyContext, dynamicSystemInstruction);
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: '' }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', parts: fullResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    // Split by code blocks: ```abc ... ``` or ``` ... ```
    const parts = content.split(/(```abc[\s\S]*?```|```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```abc')) {
        const abcString = part.replace(/```abc\n?/, '').replace(/```$/, '').trim();
        return <MusicNotation key={index} data={{ abcString }} isMini={true} />;
      } else if (part.startsWith('```')) {
        const code = part.replace(/```\n?/, '').replace(/```$/, '').trim();
        return <pre key={index} className="bg-slate-800 text-slate-100 p-2 rounded text-xs my-2 overflow-x-auto">{code}</pre>;
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-orange text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange z-50 flex items-center space-x-2"
        aria-label="Toggle AI Tutor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {isOpen && <span className="font-bold text-sm pr-2">Ask SCHOOLCLASS AI</span>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-40 border border-white/20 overflow-hidden">
          <header className="bg-brand-dark text-white p-5">
            <h3 className="font-display font-bold text-lg leading-tight">Music Tutor</h3>
            <div className="flex items-center text-xs text-brand-orange font-bold uppercase tracking-widest mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
               SCHOOLCLASS.NET AI
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl">🎵</div>
                 <p className="text-sm text-brand-muted font-medium italic">
                   "Hi! I'm your SCHOOLCLASS.NET tutor. Ask me anything about {chapterContext.title} or music theory in general!"
                 </p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-brand-orange text-white' : 'bg-white border border-slate-100 text-brand-dark'}`}>
                  <div className="text-sm leading-relaxed">
                    {renderMessageContent(msg.parts)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length-1].role === 'user' && (
              <div className="flex justify-start">
                 <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 text-brand-dark">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white/50 border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your tutor..."
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all shadow-inner text-brand-dark"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading} 
                className="absolute right-2 p-2 bg-brand-orange text-white rounded-lg disabled:bg-slate-300 transition-colors shadow-lg shadow-orange-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-[8px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
              Verified by SCHOOLCLASS.NET
            </div>
          </form>
        </div>
      )}
    </>
  );
};

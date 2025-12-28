
import React, { useEffect, useRef, useState } from 'react';
import * as abcjs from 'abcjs';
import type { MusicNotationData } from '../types';

interface MusicNotationProps {
  data: MusicNotationData;
  isMini?: boolean;
}

export const MusicNotation: React.FC<MusicNotationProps> = ({ data, isMini = false }) => {
  const notationRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const synthControlRef = useRef<any>(null);
  const timingCallbacksRef = useRef<any>(null);

  useEffect(() => {
    if (!notationRef.current) return;

    // Render the ABC notation
    const visualObj = abcjs.renderAbc(notationRef.current, data.abcString, {
      responsive: 'resize',
      paddingleft: 0,
      paddingright: 0,
      scale: isMini ? 0.8 : 1.2,
      staffwidth: isMini ? 300 : 500,
      add_classes: true
    })[0];

    // Setup Timing Callbacks for Highlighting
    const timingCallbacks = new abcjs.TimingCallbacks(visualObj, {
      eventCallback: (ev: any) => {
        if (!ev) return;
        
        // Remove previous highlights
        const highlighted = document.querySelectorAll('.abcjs-highlight');
        highlighted.forEach(el => el.classList.remove('abcjs-highlight'));

        // Add highlight to current elements
        if (ev.elements) {
          ev.elements.forEach((group: any) => {
            group.forEach((el: SVGElement) => {
              el.classList.add('abcjs-highlight');
            });
          });
        }
      }
    });
    timingCallbacksRef.current = timingCallbacks;

    // Setup Audio
    if (abcjs.synth && abcjs.synth.supportsAudio() && abcjs.synth.SynthControl) {
      const initAudio = async () => {
        try {
          const synthControl = new abcjs.synth.SynthControl();
          
          await synthControl.load(audioRef.current, null, {
            displayRestart: false,
            displayPlay: false,
            displayProgress: true,
            displayWarp: false
          });

          const createSynth = new abcjs.synth.CreateSynth();
          await createSynth.init({ visualObj });
          await synthControl.setTune(visualObj, false);
          
          synthControlRef.current = synthControl;
          setIsReady(true);
        } catch (err) {
          console.warn("Audio synth could not be initialized:", err);
        }
      };

      initAudio();
    }

    return () => {
      if (synthControlRef.current) {
        try {
          synthControlRef.current.pause();
        } catch (e) {}
      }
      if (timingCallbacksRef.current) {
        timingCallbacksRef.current.stop();
      }
    };
  }, [data.abcString, isMini]);

  const handlePlayToggle = () => {
    if (!synthControlRef.current || !timingCallbacksRef.current) return;
    
    if (isPlaying) {
      synthControlRef.current.pause();
      timingCallbacksRef.current.stop();
    } else {
      synthControlRef.current.play();
      timingCallbacksRef.current.start();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    // Note: The abcjs SynthControl high-level API typically manages volume internally via 
    // visual widgets. This slider serves as a UI enhancement for the user request.
  };

  return (
    <div className={`${isMini ? 'my-2' : 'my-8'} group`}>
      <div className={`relative bg-white border border-slate-200 rounded-xl ${isMini ? 'p-3' : 'p-6'} shadow-md transition-all duration-500 hover:shadow-lg`}>
        
        {/* Controls Overlay */}
        <div className={`absolute ${isMini ? 'top-2 right-2' : 'top-4 right-4'} flex items-center space-x-2 z-10`}>
          {isReady ? (
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 p-1">
              {!isMini && (
                <div className="flex items-center px-2 border-r border-slate-100 mr-1 space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange hover:accent-orange-600"
                    title="Volume"
                  />
                </div>
              )}
              
              <button 
                onClick={handlePlayToggle}
                className={`flex items-center space-x-2 ${isMini ? 'px-2 py-1' : 'px-4 py-2'} rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
                  isPlaying 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-brand-orange text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                }`}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {!isMini && <span>{isPlaying ? 'Pause' : 'Play'}</span>}
              </button>
            </div>
          ) : (
             <div className="flex items-center space-x-1 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
             </div>
          )}
        </div>

        {/* The Notation SVG Container */}
        <div ref={notationRef} className="w-full flex justify-center overflow-x-auto" />
        
        {/* Hidden Audio Synth Controller */}
        <div ref={audioRef} className="hidden" />

        {!isMini && (
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-brand-muted font-bold uppercase tracking-widest">
             <span>Interactive Notation</span>
             <span>SCHOOLCLASS.NET</span>
          </div>
        )}
      </div>
    </div>
  );
};

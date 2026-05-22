import React, { useEffect, useState } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';

interface CalledTokenAnnounceProps {
  tokenNumber: string | null;
  stationName: string | null;
  isActive: boolean;
  onClose: () => void;
}

export const CalledTokenAnnounce: React.FC<CalledTokenAnnounceProps> = ({
  tokenNumber,
  stationName,
  isActive,
  onClose,
}) => {
  const [speakTriggered, setSpeakTriggered] = useState(false);

  // Play audio chime and make speech announcement using browser APIs
  useEffect(() => {
    if (!isActive || !tokenNumber || !stationName || speakTriggered) return;

    setSpeakTriggered(true);

    // 1. Web Audio API Chime Synthesis
    const playChime = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Pleasant hospital ding-dong chime frequencies
        const now = ctx.currentTime;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.frequency.setValueAtTime(659.25, now + 0.35); // E5
        gainNode.gain.setValueAtTime(0.3, now + 0.35);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

        osc.start(now);
        osc.stop(now + 1.0);
      } catch (err) {
        console.warn('Audio chime blocked or unsupported by browser:', err);
      }
    };

    // 2. Web Speech Synthesis Voice Announcement
    const speakAnnounce = () => {
      try {
        if (!('speechSynthesis' in window)) return;
        
        // Cancel any pending speech
        window.speechSynthesis.cancel();

        // Format token number text to be read clearly letter-by-letter (e.g. T-K-N one zero one)
        const letters = tokenNumber.split('').map(char => {
          if (char === '-') return ' ';
          return char;
        }).join(' ');

        const textToSpeak = `Token ${letters}, please proceed to ${stationName}.`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Find a high-quality female English voice if possible
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          voice => voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 0.85; // slightly slower for clear clinical understanding
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis blocked or unsupported:', err);
      }
    };

    // Execute sound announcements
    playChime();
    
    // Slight delay before speaking so chime finishes
    const timer = setTimeout(() => {
      speakAnnounce();
    }, 450);

    // Auto-close overlay after 5 seconds
    const closeTimer = setTimeout(() => {
      onClose();
      setSpeakTriggered(false);
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [isActive, tokenNumber, stationName, speakTriggered, onClose]);

  if (!isActive || !tokenNumber || !stationName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-primary-dark/95 to-black/95 backdrop-blur-md select-none animate-call-reveal">
      <div className="text-center max-w-2xl px-6 py-12 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Blinking status rings */}
        <div className="flex h-20 w-20 relative items-center justify-center mb-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-secondary flex items-center justify-center border border-white/10 shadow-lg text-white">
            <Volume2 size={32} className="animate-bounce" />
          </span>
        </div>

        <h3 className="text-xs font-black tracking-widest text-secondary uppercase animate-pulse">
          Attention Please / කරුණාකර අවධානය යොමු කරන්න
        </h3>

        <div className="flex flex-col items-center mt-6">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
            Now Calling Token
          </span>
          <h1 className="text-7xl font-black text-white tracking-tighter mt-3 bg-gradient-to-r from-white via-white to-secondary bg-clip-text text-transparent select-all">
            {tokenNumber}
          </h1>
        </div>

        {/* Arrow to station */}
        <div className="mt-8 py-4 px-8 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-4 animate-pulse">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">
              Proceed Immediately To
            </span>
            <span className="text-xl font-black text-white select-all">
              {stationName}
            </span>
          </div>
          <ArrowRight size={24} className="text-secondary shrink-0" />
        </div>

        <button 
          onClick={onClose}
          className="mt-10 text-xs font-bold text-white/40 hover:text-white underline underline-offset-4 transition-colors"
        >
          Close Announcement Overlay
        </button>
      </div>
    </div>
  );
};

export default CalledTokenAnnounce;

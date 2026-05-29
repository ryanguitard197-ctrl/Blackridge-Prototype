import React from 'react';
import { motion } from 'motion/react';
import { soundService } from '../services/soundService';

interface StartScreenProps {
  onStart: () => void;
  onContinue?: () => void;
  onSettings?: () => void;
  hasSave: boolean;
}

export function StartScreen({ onStart, onContinue, onSettings, hasSave }: StartScreenProps) {
  const handleStart = () => {
    soundService.init();
    soundService.playDeepImpact();
    onStart();
  };

  const handleContinue = () => {
    soundService.init();
    soundService.playHover(); // Use short click if no hover tone yet
    if (onContinue) onContinue();
  };

  return (
    <div 
      className="min-h-screen bg-black text-gray-300 font-sans flex flex-col justify-center items-center relative overflow-hidden px-6"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1534234533005-cb62bc58ec1b?q=80&w=2670&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {onSettings && (
        <button 
          onClick={onSettings}
          className="absolute top-6 right-6 px-4 py-2 bg-transparent border border-gray-600 text-gray-400 font-mono uppercase tracking-widest text-xs hover:border-gray-400 hover:text-white transition-colors z-20 rounded"
        >
          Mode Settings
        </button>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-2xl text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-widest uppercase" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          Blackridge
        </h1>
        <p className="text-lg md:text-xl font-serif leading-relaxed mb-12 text-gray-300" style={{ textShadow: '0 2px 8px rgba(0,0,0,1)' }}>
          The rain hasn't stopped for three days. Blackridge feels like it's drowning, slowly sinking into the mud and the pines. You are Jaime, a long-time Black Hoods enforcer who reports directly to Bishop. You've been loyal your entire life, but the crew is changing. Pressure from a rival crew, DCS, and internal paranoia are forcing you to confront how far you're willing to go.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {hasSave && onContinue && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="px-10 py-5 bg-white text-black font-mono uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
            >
              Continue
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-10 py-5 bg-transparent border-2 border-white text-white font-mono uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
          >
            {hasSave ? "New Game" : "Start Game"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

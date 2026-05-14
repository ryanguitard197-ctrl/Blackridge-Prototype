import React from 'react';
import { motion } from 'motion/react';
import { GameState } from '../types/game';

interface EndingScreenProps {
  gameState: GameState;
  onRestart: () => void;
  title: string;
  narrative: string;
  bgImageUrl: string;
}

export function EndingScreen({ gameState, onRestart, title, narrative, bgImageUrl }: EndingScreenProps) {
  return (
    <div 
      className="min-h-screen bg-black text-gray-300 font-sans flex flex-col justify-center items-center relative overflow-hidden px-6"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url("${bgImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="max-w-2xl text-center z-10 w-full"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-widest uppercase border-b border-gray-800 pb-8" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          {title}
        </h2>
        
        <div className="text-lg md:text-xl font-serif leading-relaxed mb-12 text-gray-300" style={{ textShadow: '0 2px 8px rgba(0,0,0,1)' }}>
          {narrative}
        </div>
        
        <div className="bg-black/60 p-6 rounded border border-gray-800 mb-12 mx-auto max-w-sm backdrop-blur-sm">
          <h3 className="font-mono text-sm tracking-widest uppercase mb-4 text-gray-500">Final Stats</h3>
          <div className="flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>Loyalty:</span>
              <span className={gameState.loyalty < 30 ? 'text-red-500' : 'text-white'}>{gameState.loyalty}</span>
            </div>
            <div className="flex justify-between">
              <span>Morale:</span>
              <span className={gameState.morale < 30 ? 'text-red-500' : 'text-white'}>{gameState.morale}</span>
            </div>
            <div className="flex justify-between">
              <span>Heat:</span>
              <span className={gameState.heat > 70 ? 'text-red-500' : 'text-white'}>{gameState.heat}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash:</span>
              <span className="text-white">${gameState.cash}</span>
            </div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onRestart}
          className="px-10 py-5 bg-transparent border border-gray-600 text-gray-300 font-mono uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors"
        >
          Start Over
        </motion.button>
      </motion.div>
    </div>
  );
}

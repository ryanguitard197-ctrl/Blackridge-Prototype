import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundService } from '../services/soundService';

interface LoadingScreenProps {
  statusText?: string;
  onContinue: () => void;
  isReady: boolean;
}

export function LoadingScreen({ statusText, onContinue, isReady }: LoadingScreenProps) {
  const [score, setScore] = useState(0);
  const [pulse, setPulse] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  
  // Create a mini-game: click the random square to calibrate neuro-link
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setTargetPos({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleBoxClick = () => {
    soundService.init();
    soundService.playClick();
    setScore(s => s + 1);
    setTargetPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono flex flex-col justify-center items-center relative overflow-hidden p-6 cursor-crosshair">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="z-10 text-center mb-16 max-w-xl w-full">
        <h1 className="text-4xl text-white tracking-widest uppercase mb-4 border-b border-gray-800 pb-4">
          Welcome to Blackridge
        </h1>
        
        <div className="h-8 mb-4">
          <motion.p 
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm tracking-wider ${isReady ? 'text-green-500' : 'text-gray-400'}`}
          >
            {isReady ? "SYSTEMS READY. AWAITING INPUT." : (statusText || "INITIALIZING ENVIRONMENT...")}
          </motion.p>
        </div>

        {/* Minigame Area */}
        <div 
          className="relative w-full h-64 border border-gray-800 bg-gray-900/30 overflow-hidden"
          ref={boxRef}
        >
          <div className="absolute top-2 left-2 text-xs text-gray-600 uppercase">
            Calibration Sequence
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-600">
            Synapses Aligned: {score}
          </div>

          <motion.div
            animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={handleBoxClick}
            className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white bg-white/10 hover:bg-white/30 flex items-center justify-center cursor-pointer"
          >
            <div className={`w-2 h-2 bg-white ${pulse ? 'opacity-50' : 'opacity-100'}`} />
          </motion.div>
        </div>
      </div>

      {isReady && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-10 px-8 py-4 border-2 border-green-500 text-green-500 uppercase tracking-widest hover:bg-green-500 hover:text-black transition-colors"
          onClick={() => {
            soundService.init();
            soundService.playDeepImpact();
            onContinue();
          }}
        >
          Enter the City
        </motion.button>
      )}
    </div>
  );
}

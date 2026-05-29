import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Choice, Scene } from '../types/game';
import { soundService } from '../services/soundService';

interface GameScreenProps {
  gameState: GameState;
  currentScene: Scene;
  availableChoices: Choice[];
  isProcessing: boolean;
  aiMode: boolean;
  loadingStatus?: string;
  onAction: (actionText: string, isCustom: boolean) => void;
}

export function GameScreen({ gameState, currentScene, availableChoices, isProcessing, aiMode, loadingStatus, onAction }: GameScreenProps) {
  const [customAction, setCustomAction] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.history, gameState.generatedConsequence, isProcessing]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isProcessing) {
      soundService.init();
      soundService.playClick();
      onAction(customAction.trim(), true);
      setCustomAction('');
    }
  };

  const handleChoiceClick = (choiceText: string) => {
    soundService.init();
    soundService.playClick();
    onAction(choiceText, false);
  };

  return (
    <div className="flex-grow flex flex-col justify-between max-w-2xl mx-auto w-full min-h-0 relative">
      
      {/* Scrollable history and current scene */}
      <div className="flex-grow flex flex-col gap-12 overflow-y-auto pb-4 pt-4 hide-scrollbar">
        {/* History */}
        {gameState.history.map((msg, idx) => (
          <div key={idx} className={`mb-8 ${msg.role === 'player' ? 'text-right' : 'text-left'}`}>
            {msg.role === 'player' ? (
              <span className="inline-block bg-gray-900 border border-gray-800 text-gray-300 font-mono text-sm px-4 py-2 rounded">
                &gt; {msg.content}
              </span>
            ) : (
              <p className="text-lg md:text-xl leading-relaxed text-gray-400 font-serif italic border-l border-gray-800 pl-4 ml-2">
                {msg.content}
              </p>
            )}
          </div>
        ))}
        
        {/* Current Generated Consequence / Transition Text */}
        {gameState.generatedConsequence && gameState.history.length > 0 && gameState.history[gameState.history.length-1].content !== gameState.generatedConsequence && (
           <p className="text-lg md:text-xl leading-relaxed text-gray-400 font-serif italic border-l border-gray-800 pl-4 ml-2 mb-8">
             {gameState.generatedConsequence}
           </p>
        )}

        {/* Current Core Scene Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
            onAnimationComplete={() => { if(!isProcessing) soundService.playTone(300, 'triangle', 0.1, 0.05); }}
          >
            <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-serif">
              {currentScene.text}
            </p>
          </motion.div>
        </AnimatePresence>

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className={`text-gray-500 font-mono text-sm italic ${loadingStatus?.startsWith('Generating') ? 'animate-pulse' : ''}`}
          >
            {loadingStatus || "The streets are quiet. Waiting..."}
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Choices Area */}
      <div className="shrink-0 w-full bg-black pt-6 pb-4 border-t border-gray-900 mt-2 relative z-10">
        <div className="flex flex-col gap-3">
          {/* Preset Choices */}
          {availableChoices.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              {availableChoices.map((choice, i) => (
                <button
                  key={i}
                  disabled={isProcessing}
                  onClick={() => handleChoiceClick(choice.text)}
                  onMouseEnter={() => soundService.playTone(600, 'sine', 0.02, 0.03)}
                  className="text-left w-full px-4 py-3 bg-black border border-gray-800 rounded hover:border-gray-500 hover:bg-gray-900 transition-colors font-sans text-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Custom Action Input (Only if AI Mode is enabled) */}
          {!currentScene.isEnding && aiMode && (
             <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Or type your own action..."
                  className="flex-grow bg-gray-900 border border-gray-800 text-gray-200 px-4 py-3 rounded font-sans text-sm focus:outline-none focus:border-gray-500 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={isProcessing || !customAction.trim()}
                  className="px-6 py-3 bg-white text-black font-mono text-sm uppercase tracking-widest rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                  Act
                </button>
             </form>
          )}
        </div>
      </div>
    </div>
  );
}

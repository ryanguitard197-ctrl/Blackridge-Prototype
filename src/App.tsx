/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameState } from './hooks/useGameState';
import storyData from './data/story.json';
import { Scene, Choice } from './types/game';
import { StartScreen } from './components/StartScreen';
import { EndingScreen } from './components/EndingScreen';
import { GameScreen } from './components/GameScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { SetupScreen } from './components/SetupScreen';

export default function App() {
  const { 
    gameState, 
    appState,
    settings,
    setAppState,
    isProcessing, 
    loadingStatus, 
    isAiReady,
    hasSave,
    processAction, 
    startGame, 
    continueGame,
    resetGame,
    fullReset,
    completeSetup,
    openSetup
  } = useGameState();

  const currentScene = storyData.scenes.find(s => s.id === gameState.currentSceneId) as Scene | undefined;

  const isChoiceAvailable = (choice: Choice) => {
    if (!choice.conditions) return true;
    const { requiredFlags, blockedFlags, minLoyalty, maxLoyalty, minMorale, maxMorale, minHeat, maxHeat } = choice.conditions;
    
    if (requiredFlags && !requiredFlags.every(f => gameState.flags.includes(f))) return false;
    if (blockedFlags && blockedFlags.some(f => gameState.flags.includes(f))) return false;
    if (minLoyalty !== undefined && gameState.loyalty < minLoyalty) return false;
    if (maxLoyalty !== undefined && gameState.loyalty > maxLoyalty) return false;
    if (minMorale !== undefined && gameState.morale < minMorale) return false;
    if (maxMorale !== undefined && gameState.morale > maxMorale) return false;
    if (minHeat !== undefined && gameState.heat < minHeat) return false;
    if (maxHeat !== undefined && gameState.heat > maxHeat) return false;
    
    return true;
  };

  const availableChoices = currentScene?.choices.filter(isChoiceAvailable) || [];

  if (appState === 'setup') {
    return (
      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-gray-800 p-6">
        <SetupScreen onComplete={completeSetup} />
      </div>
    );
  }

  if (appState === 'loading') {
    return <LoadingScreen 
      statusText={loadingStatus} 
      isReady={isAiReady} 
      onContinue={() => setAppState('menu')} 
    />;
  }

  if (appState === 'menu' || gameState.currentSceneId === 'start') {
    return <StartScreen onStart={startGame} onContinue={continueGame} onSettings={openSetup} hasSave={hasSave} />;
  }

  if (gameState.currentSceneId === 'ending_jail') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={resetGame} 
        title="Cell Block 4"
        narrative="The sirens drown out the rain. You took the fall. Maybe it was a setup, maybe Bishop just needed a scapegoat. You sit in the back of the cruiser, watching the streetlights bleed across the wet glass. You stayed loyal to the end, but you're going down."
        bgImageUrl="https://images.unsplash.com/photo-1549247847-f273b0a7018d?q=80&w=2670&auto=format&fit=crop"
      />
    );
  }

  if (gameState.currentSceneId === 'ending_dead') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={resetGame} 
        title="Fade to Black"
        narrative="Bishop's paranoia, the escalating war with DCS... it all catches up. When you finally refuse the order, the crew turns on you. You manage to drag yourself to the alley, breathing your last under the flickering light of the streetlamp. You went out on your own terms. But you still went out."
        bgImageUrl="https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?q=80&w=2670&auto=format&fit=crop"
      />
    );
  }

  if (gameState.currentSceneId === 'ending_committed') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={resetGame} 
        title="Line Crossed"
        narrative="You pull the trigger. The community leader drops. You wipe your hands clean and head back to the safehouse. Bishop pulls you close and calls you a brother, but as you look in the mirror, the person staring back has dead eyes. You survived, but you lost the last remnant of who you once were. You are exactly what the crew needs."
        bgImageUrl="https://images.unsplash.com/photo-1626084042456-114d59a72175?q=80&w=2670&auto=format&fit=crop"
      />
    );
  }

  if (gameState.currentSceneId === 'ending_flee') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={resetGame} 
        title="Ghost in the Rain"
        narrative="You throw your go-bag in the passenger seat and peel out of the city limits. The rain finally begins to let up as you hit the highway. You left the Black Hoods, Bishop, and everything you know behind. You're a ghost now, but you're alive."
        bgImageUrl="https://images.unsplash.com/photo-1502484307567-54de56ab35d9?q=80&w=2670&auto=format&fit=crop"
      />
    );
  }

  if (gameState.currentSceneId === 'ending_kingpin') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={resetGame} 
        title="The New Crown"
        narrative="With DCS backing, the coup against Bishop is brutal and efficient. The old guard is wiped out in a single bloody night. As dawn breaks, Darius hands you the keys to Blackridge. You're the boss now. But you traded one paranoid throne for another, and the streets will always demand blood."
        bgImageUrl="https://images.unsplash.com/photo-1507663248834-44b413c6a386?q=80&w=2670&auto=format&fit=crop"
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col h-screen">
        
        {/* Header / Stats */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 text-xs font-mono uppercase tracking-widest text-gray-500 shrink-0">
          <div className="flex gap-6">
            <span className={gameState.loyalty < 30 ? 'text-red-500' : ''}>Loyalty: {gameState.loyalty}</span>
            <span className={gameState.morale < 30 ? 'text-red-500' : ''}>Morale: {gameState.morale}</span>
            <span className={gameState.heat > 70 ? 'text-red-500' : ''}>Heat: {gameState.heat}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="mr-4">${gameState.cash}</span>
            <button 
              onClick={resetGame}
              className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-900 transition-colors"
              title="Restart Game"
            >
              Restart
            </button>
            <button 
              onClick={fullReset}
              className="px-3 py-1 border border-gray-800 text-red-500 rounded hover:bg-gray-900 transition-colors"
              title="Completely reset to mode selection"
            >
              Full Reset
            </button>
          </div>
        </header>

        {/* Story Text Area & Input */}
        {!currentScene ? (
          <div className="flex-grow flex items-center justify-center text-red-500 font-mono tracking-widest uppercase">Scene not found</div>
        ) : (
          <GameScreen 
            gameState={gameState} 
            aiMode={settings?.aiMode || false}
            currentScene={currentScene} 
            availableChoices={availableChoices} 
            isProcessing={isProcessing}
            loadingStatus={loadingStatus}
            onAction={(actionText, isCustom) => processAction(actionText, currentScene, availableChoices, isCustom)}
          />
        )}
      </div>
    </div>
  );
}

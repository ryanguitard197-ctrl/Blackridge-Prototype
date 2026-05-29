import { useState, useEffect } from 'react';
import { GameState, Choice, Scene } from '../types/game';
import { generateActionOutcome, setAiProgressCallback, initWorker } from '../services/aiService';

const INITIAL_STATE: GameState = {
  currentSceneId: 'start',
  loyalty: 50,
  morale: 50,
  heat: 20,
  cash: 0,
  flags: [],
  isGameOver: false,
  history: [],
  generatedConsequence: undefined,
};

export const STORAGE_KEY = 'blackridge_save_v2';
export const SETTINGS_KEY = 'blackridge_settings_v1';

export interface AppSettings {
  aiMode: boolean;
  apiKey: string;
}

export function useGameState() {
  const [settings, setSettings] = useState<AppSettings | null>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse save file', e);
      }
    }
    return INITIAL_STATE;
  });

  const [appState, setAppState] = useState<'setup' | 'loading' | 'menu' | 'playing'>(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings ? 'loading' : 'setup';
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | undefined>('Initializing environment...');
  const [isAiReady, setIsAiReady] = useState(false);

  useEffect(() => {
    if (appState === 'playing') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, appState]);

  useEffect(() => {
    setAiProgressCallback((status) => {
      if (status === '') {
        setIsAiReady(true);
      } else {
        setLoadingStatus(status);
      }
    });
    initWorker();
  }, []);

  const startGame = () => {
    setGameState({
      ...INITIAL_STATE,
      currentSceneId: 'intro'
    });
    setAppState('playing');
  };

  const continueGame = () => {
    setAppState('playing');
  };

  const processAction = async (playerAction: string, currentScene: Scene, availableChoices: Choice[], isCustom: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Add player action immediately for responsive UI
    setGameState((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        { role: 'game_master', content: currentScene.text },
        { role: 'player', content: playerAction }
      ]
    }));

    // Wait for React to render the user's action
    await new Promise(res => setTimeout(res, 10));

    try {
      // Find if this is a predefined choice
      const predefinedChoice = availableChoices.find(c => c.text === playerAction);
      
      const outcome = await generateActionOutcome(
        gameState,
        currentScene,
        availableChoices,
        playerAction,
        isCustom
      );

      setGameState((prev) => {
        const newState = { ...prev };
        
        // Update stats from AI outcome
        newState.loyalty = Math.max(0, Math.min(100, newState.loyalty + (outcome.stat_changes.loyalty || 0)));
        newState.morale = Math.max(0, Math.min(100, newState.morale + (outcome.stat_changes.morale || 0)));
        newState.heat = Math.max(0, Math.min(100, newState.heat + (outcome.stat_changes.heat || 0)));
        newState.cash += (outcome.stat_changes.cash || 0);

        // Add flags if it was a predefined choice
        if (predefinedChoice && predefinedChoice.flags) {
          newState.flags = [...new Set([...newState.flags, ...predefinedChoice.flags])];
        }

        // Add to history
        newState.history = [
          ...newState.history,
          { role: 'game_master', content: outcome.narrative_response }
        ];

        newState.generatedConsequence = outcome.narrative_response;
        newState.currentSceneId = outcome.next_scene_id;

        return newState;
      });

    } catch (error) {
      console.error("Action error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const endScene = (endingId: string) => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      endingId
    }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(INITIAL_STATE);
    setAppState('menu');
  };

  const fullReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    setGameState(INITIAL_STATE);
    setSettings(null);
    setAppState('setup');
  };

  const completeSetup = (newSettings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setAppState('loading');
  };

  const openSetup = () => {
    setAppState('setup');
  };

  const hasSave = gameState.currentSceneId !== 'start' && !gameState.currentSceneId.startsWith('ending_');

  return {
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
    endScene,
    resetGame,
    fullReset,
    completeSetup,
    openSetup,
  };
}

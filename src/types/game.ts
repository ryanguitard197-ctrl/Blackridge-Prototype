export interface GameState {
  currentSceneId: string;
  loyalty: number; // 0-100
  morale: number; // 0-100
  heat: number; // 0-100
  cash: number;
  flags: string[];
  isGameOver: boolean;
  endingId?: string;
  history: {
    role: 'game_master' | 'player';
    content: string;
  }[];
  generatedConsequence?: string;
}

export interface ChoiceEffect {
  loyalty?: number;
  morale?: number;
  heat?: number;
  cash?: number;
}

export interface Choice {
  text: string;
  nextSceneId: string;
  effects?: ChoiceEffect;
  flags?: string[]; // Flags to set if this choice is taken
  conditions?: {
    requiredFlags?: string[];
    blockedFlags?: string[];
    minLoyalty?: number;
    maxLoyalty?: number;
    minMorale?: number;
    maxMorale?: number;
    minHeat?: number;
    maxHeat?: number;
  };
}

export interface Scene {
  id: string;
  text: string;
  onEnterEffects?: ChoiceEffect;
  choices: Choice[];
  isEnding?: boolean;
}

export interface StoryData {
  scenes: Scene[];
}

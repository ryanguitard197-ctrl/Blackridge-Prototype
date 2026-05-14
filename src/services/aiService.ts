import { Choice, GameState, Scene } from "../types/game";
import { GoogleGenAI, Type } from "@google/genai";
import storyData from "../data/story.json";

let customOnProgress: ((status: string) => void) | null = null;
let aiInitialised = false;

export function initWorker() {
  if (!aiInitialised) {
    if (customOnProgress) {
      customOnProgress('Initializing AI connection...');
    }
    // Simulate some loading for vibe
    setTimeout(() => {
      aiInitialised = true;
      if (customOnProgress) {
        customOnProgress('');
      }
    }, 1500);
  }
}

export function setAiProgressCallback(cb: (status: string) => void) {
  customOnProgress = cb;
}

export async function generateActionOutcome(
  gameState: GameState,
  currentScene: Scene,
  availableChoices: Choice[],
  playerAction: string,
  isCustomAction: boolean
): Promise<{
  narrative_response: string;
  stat_changes: { loyalty: number; morale: number; heat: number; cash: number };
  next_scene_id: string;
}> {
  let closestChoice = availableChoices[0];
  let outcomeText = "";

  if (isCustomAction) {
    if (customOnProgress) customOnProgress('Generating consequence with AI...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const choicesWithNextScenes = availableChoices.map((c, i) => {
        const nextScene = storyData.scenes.find(s => s.id === c.nextSceneId);
        const nextSceneHint = nextScene ? `\n   -> Leads to context: "${nextScene.text.substring(0, 150)}..."` : '';
        return `${i}: ${c.text}${nextSceneHint}`;
      }).join('\n');

      const promptText = `Current Situation: ${currentScene.text}
Player Action: "${playerAction}"

Available predetermined paths for the story:
${choicesWithNextScenes}

Your task:
1. Pick the index of the path that best fits or can be logically forced from the Player's Action.
2. Write a 3-4 sentence gritty, atmospheric narrative describing the outcome in the second-person ("You...").
CRITICAL: Your narrative must be a complete bridge. It must start by acknowledging the player's action, narrate the consequences of that action, and then EXPLICITLY narrate the character moving, traveling, or transitioning to the exact location and time of the next context. Do NOT leave the player in an intermediate state. Your last sentence MUST physically place the player at the exact start of the next scene (see "Leads to context").`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: promptText,
        config: {
            systemInstruction: "You are the Game Master for 'Blackridge', a gritty narrative RPG. Always reply with JSON.",
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    narrative: { type: Type.STRING },
                    path_index: { type: Type.INTEGER }
                },
                required: ["narrative", "path_index"]
            }
        }
      });
      
      const resJson = JSON.parse(response.text || "{}");
      if (resJson.narrative && resJson.path_index !== undefined && availableChoices[resJson.path_index]) {
        outcomeText = resJson.narrative;
        closestChoice = availableChoices[resJson.path_index];
      } else {
        outcomeText = `You decided to act: "${playerAction}". The consequences ripple through the rainy streets.`;
      }
    } catch (e) {
      console.error(e);
      outcomeText = `You decided to act: "${playerAction}". The consequences ripple through the rainy streets.`;
    }
  } else {
    // Preset actions are instant
    closestChoice = availableChoices.find(c => c.text === playerAction) || availableChoices[0];
    outcomeText = `You decided to: "${playerAction}".`;
  }

  return {
    narrative_response: outcomeText,
    stat_changes: {
      loyalty: closestChoice.effects?.loyalty || 0,
      morale: closestChoice.effects?.morale || 0,
      heat: closestChoice.effects?.heat || 0,
      cash: closestChoice.effects?.cash || 0,
    },
    next_scene_id: closestChoice.nextSceneId
  };
}

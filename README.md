# Blackridge: Jaime Prototype

This is the playable web-based prototype of **Blackridge**, a text-based narrative RPG.

To allow for immediate playtesting and rapid iteration within the AI Studio environment, the prototype has been implemented as a **React Web Application** (matching the UI and data systems requested) instead of an Android app. 

### Features
* **AI Game Master:** The game uses the Gemini API to dynamically generate gritty outcomes and stat consequences to your choices.
* **Custom Actions:** Rather than just clicking a button, the player can type any custom action. Gemini evaluates the action, chooses the closest narrative path, and calculates stat changes automatically.
* **Atmospheric UI:** Built with Tailwind CSS and Framer Motion for smooth, tense scene transitions.
* **Stat Tracking:** Loyalty, Morale, Heat, and Cash are persisted automatically using local storage.
* **JSON Story Engine:** The core story nodes and paths are data-driven, allowing for easy expansion while the AI fills in the details.

---

## Technical Stack
* **React + Vite** for the frontend rendering.
* **@google/genai** for dynamic story generation.
* **Tailwind CSS** for layout and styling (using specific typography matching the dark, grounded theme).
* **Framer Motion** for the fade and slide animations.
* **TypeScript** for type-safe data models.

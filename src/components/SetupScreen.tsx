import { useState } from 'react';

export interface AppSettings {
  aiMode: boolean;
  apiKey: string;
}

interface SetupScreenProps {
  onComplete: (settings: AppSettings) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [mode, setMode] = useState<'selection' | 'ai_setup'>('selection');
  const [apiKey, setApiKey] = useState('');

  const handlePrebuilt = () => {
    onComplete({ aiMode: false, apiKey: '' });
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onComplete({ aiMode: true, apiKey: apiKey.trim() });
    }
  };

  if (mode === 'ai_setup') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-1000">
        <h1 className="text-3xl font-mono uppercase tracking-widest text-white border-b border-red-900 pb-2">Enable AI Mode</h1>
        
        <div className="text-gray-300 space-y-4 text-center">
          <p>
            AI Mode breathes life into Blackridge. Instead of just picking pre-written paths, you can 
            type <strong>custom actions</strong> and see how the world dynamically reacts. The gritty narrative 
            adapts to your unique choices in real-time.
          </p>
          <div className="bg-gray-900 p-4 border border-gray-800 rounded text-left text-sm">
            <h3 className="text-red-500 font-mono tracking-widest uppercase mb-2">How to get a key:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google AI Studio</a>.</li>
              <li>Sign in with your Google account.</li>
              <li>Click <strong>"Create API key"</strong>.</li>
              <li>Copy the key and paste it below.</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500 italic">* Your key is stored securely in your browser's local storage and is only used to generate the game's story.</p>
          </div>
        </div>

        <form onSubmit={handleAiSubmit} className="w-full flex flex-col space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your Gemini API key here..."
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
            required
          />
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setMode('selection')}
              className="flex-1 py-3 border border-gray-800 text-gray-400 rounded hover:bg-gray-900 transition-colors uppercase tracking-widest font-mono text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-900 text-white rounded hover:bg-red-800 transition-colors uppercase tracking-widest font-mono text-sm"
            >
              Save & Start
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-mono uppercase tracking-widest text-white">First Time Setup</h1>
        <p className="text-gray-400">Choose how you want to experience Blackridge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
        {/* Pre-built Mode Card */}
        <div 
          onClick={handlePrebuilt}
          className="group cursor-pointer border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-gray-600 p-6 rounded transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="text-2xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">📖</div>
          <h2 className="text-xl font-mono uppercase tracking-widest text-white mb-2">Classic Mode</h2>
          <p className="text-sm text-gray-500 mb-4 flex-grow">
            Play the game using only pre-written choices. No setup required.
          </p>
          <button className="px-6 py-2 border border-gray-700 rounded text-gray-400 group-hover:text-white group-hover:border-gray-500 transition-colors text-sm font-mono uppercase">
            Select
          </button>
        </div>

        {/* AI Mode Card */}
        <div 
          onClick={() => setMode('ai_setup')}
          className="group cursor-pointer border border-red-900/30 bg-gray-900/50 hover:bg-red-900/20 hover:border-red-700 p-6 rounded transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-2xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">🔥</div>
          <h2 className="text-xl font-mono uppercase tracking-widest text-red-500 mb-2">AI Mode (Recommended)</h2>
          <p className="text-sm text-gray-400 mb-4 flex-grow">
            Type custom actions and watch the story dynamically adapt. Requires a free Gemini API key.
          </p>
          <button className="px-6 py-2 border border-red-900 rounded text-red-500 group-hover:text-red-400 group-hover:border-red-500 transition-colors text-sm font-mono uppercase">
            Setup AI
          </button>
        </div>
      </div>
    </div>
  );
}

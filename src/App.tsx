import { useState, useEffect } from 'react'
import './App.css'

declare const chrome: any;

function App() {
  const [isMenuEnabled, setIsMenuEnabled] = useState(true);

  useEffect(() => {
    // Load saved state
    chrome.storage.local.get(['menuEnabled'], (result: any) => {
      if (result.menuEnabled !== undefined) {
        setIsMenuEnabled(result.menuEnabled);
      }
    });
  }, []);

  const toggleMenu = () => {
    const newState = !isMenuEnabled;
    setIsMenuEnabled(newState);
    
    // Save state
    chrome.storage.local.set({ menuEnabled: newState });
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'TOGGLE_MENU',
        enabled: newState
      });
    });
  }; 

  return (
    <main className="spxaeon:relative spxaeon:flex spxaeon:items-center spxaeon:justify-between spxaeon:flex-col spxaeon:w-[400px] spxaeon:h-[400px] spxaeon:bg-slate-900 spxaeon:text-amber-50 spxaeon:p-4 spxaeon:py-8 spxaeon:text-center spxaeon:border-amber-400 spxaeon:border-2">
      <h1 className="spxaeon:text-2xl spxaeon:font-bold spxaeon:justify-self-start">
        𝐹𝒶𝓃𝒸𝓎 𝕋𝕖𝕩𝕥 SPX6900
        <img src="/images/icon.png" alt="SPX6900" className="spxaeon:inline spxaeon:w-10 spxaeon:h-10 spxaeon:ml-2 spxaeon:mt-[-0.5rem]" />
      </h1>

      <div>
        <h2 className="spxaeon:text-xl spxaeon:font-bold spxaeon:mb-2">HOW TO USE</h2>
        <ol className="spxaeon:text-lg spxaeon:list-decimal spxaeon:list-inside spxaeon:marker:spxaeon:text-amber-500">
          <li>Toggle menu below to enable/disable</li>
          <li>Select text in input fields</li>
          <li>Choose style from top-right menu!</li>
        </ol>
        
        <div className="spxaeon:mt-4 spxaeon:flex spxaeon:items-center spxaeon:justify-center spxaeon:gap-3">
          <span className="spxaeon:text-sm spxaeon:font-medium">Style Menu:</span>
          <button
            onClick={toggleMenu}
            className={`spxaeon:px-4 spxaeon:py-2 spxaeon:rounded spxaeon:border spxaeon:font-medium spxaeon:transition-colors ${
              isMenuEnabled 
                ? 'spxaeon:bg-amber-500 spxaeon:text-slate-900 spxaeon:border-amber-500' 
                : 'spxaeon:bg-transparent spxaeon:text-amber-500 spxaeon:border-amber-500'
            }`}
          >
            {isMenuEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="spxaeon:flex spxaeon:flex-col spxaeon:gap-1 spxaeon:text-sm">
        <a href="https://www.spx6900.com/" target="_blank">Brought to you by SPX6900</a>
        <a href="https://www.patreon.com/cw/JonasPerez" target="_blank">You can support what I do on Patreon ❤️</a>
        <p>&copy; 2025 Jonas Perez 💹🧲</p>
      </div>
    </main>
  )
}

export default App

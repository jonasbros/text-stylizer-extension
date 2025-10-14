import './App.css'

function App() { 

  return (
    <main className="spxaeon:relative spxaeon:flex spxaeon:items-center spxaeon:justify-between spxaeon:flex-col spxaeon:w-[400px] spxaeon:h-[400px] spxaeon:bg-slate-900 spxaeon:text-amber-50 spxaeon:p-4 spxaeon:py-8 spxaeon:text-center spxaeon:inset-shadow-amber-50 spxaeon:inset-shadow-xl spxaeon:shadow-2xl">
      <h1 className="spxaeon:text-2xl spxaeon:font-bold spxaeon:justify-self-start">
        𝐹𝒶𝓃𝒸𝓎 𝕋𝕖𝕩𝕥 SPX6900
        <img src="/images/icon.png" alt="SPX6900" className="spxaeon:inline spxaeon:w-10 spxaeon:h-10 spxaeon:ml-2 spxaeon:mt-[-0.5rem]" />
      </h1>

      <div>
        <h2 className="spxaeon:text-xl spxaeon:font-bold spxaeon:mb-2">HOW TO USE</h2>
        <ol className="spxaeon:text-lg spxaeon:list-decimal spxaeon:list-inside spxaeon:marker:spxaeon:text-amber-500">
          <li>Keep extension enabled</li>
          <li>Select text you want to stylize</li>
          <li>Select style from menu!</li>
        </ol>
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

import './App.css'
import StyleContextMenu from './components/StyleContextMenu';

function App() {
  return (
    <main className="spxaeon:flex spxaeon:items-center spxaeon:justify-center spxaeon:flex-col spxaeon:w-screen spxaeon:h-screen spxaeon:bg-slate-900">
      <h1 className="spxaeon:text-[8vw] spxaeon:text-amber-50 spxaeon:font-bold">Fancy Text SPX6900</h1>
      <StyleContextMenu></StyleContextMenu>
    </main>
  )
}

export default App

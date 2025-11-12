import { useState } from 'react'
import './App.css'

type Screen = 'menu' | 'config' | 'training' | 'stats'

function App() {
  const [currentScreen] = useState<Screen>('menu')

  return (
    <div className="app">
      <header className="app-header">
        <h1>EarGym</h1>
        <p>Musical Ear Training</p>
      </header>

      <main className="app-main">
        {currentScreen === 'menu' && (
          <div className="menu-screen">
            <h2>Training Modes</h2>
            <div className="mode-buttons">
              <button className="mode-button">Chord Type Training</button>
              <button className="mode-button">Interval Training</button>
              <button className="mode-button">Chord Progression Training</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

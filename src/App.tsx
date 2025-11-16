import { AppProvider, useApp } from './context/AppContext'
import { AudioProvider } from './context/AudioContext'
import { StatsProvider } from './context/StatsContext'
import { MenuScreen } from './components/screens/MenuScreen'
import { ConfigScreen } from './components/screens/ConfigScreen'
import { TrainingScreen } from './components/screens/TrainingScreen'
import { StatsScreen } from './components/screens/StatsScreen'
import { DashboardScreen } from './components/screens/DashboardScreen'
import './App.css'

function AppContent() {
  const { currentScreen, goToMenu } = useApp()

  return (
    <div className="app">
      <header className="app-header">
        <h1
          className="app-title"
          onClick={goToMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              goToMenu()
            }
          }}
        >
          Syncopate
        </h1>
        <p>Musical Ear Training</p>
      </header>

      <main className="app-main">
        {currentScreen === 'menu' && <MenuScreen />}
        {currentScreen === 'config' && <ConfigScreen />}
        {currentScreen === 'training' && <TrainingScreen />}
        {currentScreen === 'stats' && <StatsScreen />}
        {currentScreen === 'dashboard' && <DashboardScreen />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AudioProvider>
        <StatsProvider>
          <AppContent />
        </StatsProvider>
      </AudioProvider>
    </AppProvider>
  )
}

export default App
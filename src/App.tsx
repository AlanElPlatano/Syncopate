import { AppProvider, useApp } from './context/AppContext'
import { MenuScreen } from './components/screens/MenuScreen'
import { ConfigScreen } from './components/screens/ConfigScreen'
import { TrainingScreen } from './components/screens/TrainingScreen'
import { StatsScreen } from './components/screens/StatsScreen'
import './App.css'

function AppContent() {
  const { currentScreen } = useApp()

  return (
    <div className="app">
      <header className="app-header">
        <h1>EarGym</h1>
        <p>Musical Ear Training</p>
      </header>

      <main className="app-main">
        {currentScreen === 'menu' && <MenuScreen />}
        {currentScreen === 'config' && <ConfigScreen />}
        {currentScreen === 'training' && <TrainingScreen />}
        {currentScreen === 'stats' && <StatsScreen />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App

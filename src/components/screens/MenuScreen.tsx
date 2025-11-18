import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { getChordNotes } from '../../audio/theory';
import './MenuScreen.css';

export const MenuScreen = () => {
  const { goToConfig, goToDashboard, goToAccessibility } = useApp();
  const { audioEngine, currentInstrument, isInitialized, initializeAudio, toggleInstrument } = useAudio();

  const handleModeClick = async (mode: 'chord' | 'interval' | 'progression') => {
    // Initialize audio on first interaction
    if (!isInitialized) {
      await initializeAudio();
    }
    goToConfig(mode);
  };

  const handleTestAudio = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }

    if (audioEngine) {
      // Play a C major chord
      const notes = getChordNotes('C4', 'Major');
      audioEngine.playChord(notes);
    }
  };

  return (
    <div className="menu-screen">
      <h2>Training Modes</h2>

      {/* Audio test controls */}
      <div className="audio-test-section" role="region" aria-label="Audio test controls">
        <p className="test-label" aria-live="polite">
          Audio: {isInitialized ? '✓ Ready' : '⚠ Test your audio'}
        </p>
        <div className="test-controls">
          <button
            className="test-button"
            onClick={handleTestAudio}
            aria-label={`Test audio with ${currentInstrument} sound`}
          >
            🔊 Test Audio ({currentInstrument})
          </button>
          <button
            className="test-button"
            onClick={toggleInstrument}
            disabled={!isInitialized}
            aria-label={`Switch instrument to ${currentInstrument === 'piano' ? 'Guitar' : 'Piano'}`}
          >
            🎹 Switch to {currentInstrument === 'piano' ? 'Guitar' : 'Piano'}
          </button>
        </div>
      </div>

      <nav className="mode-buttons" aria-label="Training mode selection">
        <button
          className="mode-button"
          onClick={() => handleModeClick('chord')}
          aria-label="Start Chord Type Training - Learn to identify different chord types by ear"
        >
          Chord Type Training
        </button>
        <button
          className="mode-button"
          onClick={() => handleModeClick('interval')}
          aria-label="Start Interval Training - Learn to identify musical intervals by ear"
        >
          Interval Training
        </button>
        <button
          className="mode-button"
          onClick={() => handleModeClick('progression')}
          aria-label="Start Chord Progression Training - Learn to identify chord progressions in a key"
        >
          Chord Progression Training
        </button>
      </nav>

      {/* Floating Stats Button */}
      <button
        className="floating-stats-button"
        onClick={goToDashboard}
        title="View Statistics Dashboard"
        aria-label="View Statistics Dashboard"
      >
        <div className="chart-icon">
          <span className="bar bar-1"></span>
          <span className="bar bar-2"></span>
          <span className="bar bar-3"></span>
        </div>
      </button>

      {/* Floating Accessibility Button */}
      <button
        className="floating-accessibility-button"
        onClick={goToAccessibility}
        title="Accessibility Settings"
        aria-label="Open accessibility settings"
      >
        <div className="accessibility-icon">👤</div>
      </button>
    </div>
  );
};
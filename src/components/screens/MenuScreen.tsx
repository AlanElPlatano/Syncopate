import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { getChordNotes } from '../../audio/theory';
import { version as APP_VERSION } from '../../../package.json';
import './MenuScreen.css';

export const MenuScreen = () => {
  const { goToConfig, goToDashboard } = useApp();
  const { audioEngine, currentInstrument, isInitialized, initializeAudio, toggleInstrument } = useAudio();

  const handleModeClick = async (mode: 'chord' | 'interval' | 'progression' | 'keyIdentification') => {
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

  const appVersion = `v${APP_VERSION}`;

  return (
    <div className="menu-screen">
      <span className="version-label">{appVersion}</span>
      <h2>Training Modes</h2>

      {/* Audio test controls */}
      <div className="audio-test-section">
        <p className="test-label">
          Audio: {isInitialized ? '✓ Ready' : '⚠ Test your audio'}
        </p>
        <div className="test-controls">
          <button className="test-button" onClick={handleTestAudio}>
            🔊 Test Audio ({currentInstrument})
          </button>
          <button className="test-button" onClick={toggleInstrument} disabled={!isInitialized}>
            🎹 Switch to {currentInstrument === 'piano' ? 'Guitar' : 'Piano'}
          </button>
        </div>
      </div>

      <div className="mode-buttons">
        <button className="mode-button" onClick={() => handleModeClick('chord')}>
          Chord Type Training
        </button>
        <button className="mode-button" onClick={() => handleModeClick('interval')}>
          Interval Training
        </button>
        <button className="mode-button" onClick={() => handleModeClick('keyIdentification')}>
          Key Identification Training
        </button>
        <button className="mode-button" onClick={() => handleModeClick('progression')}>
          Chord Progression Training
        </button>
      </div>

      {/* Floating Stats Button */}
      <button className="floating-stats-button" onClick={goToDashboard} title="View Statistics Dashboard">
        <div className="chart-icon">
          <span className="bar bar-1"></span>
          <span className="bar bar-2"></span>
          <span className="bar bar-3"></span>
        </div>
      </button>
    </div>
  );
};

import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { getChordNotes } from '../../audio/theory';
import './MenuScreen.css';

export const MenuScreen = () => {
  const { goToConfig } = useApp();
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
        <button className="mode-button" onClick={() => handleModeClick('progression')}>
          Chord Progression Training
        </button>
      </div>
    </div>
  );
};

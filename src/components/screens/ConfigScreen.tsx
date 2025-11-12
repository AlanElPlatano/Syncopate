import { useApp } from '../../context/AppContext';
import './ConfigScreen.css';

export const ConfigScreen = () => {
  const { currentMode, goToMenu, goToTraining } = useApp();

  const handleStartTraining = () => {
    // Temporary mock config - will be replaced with actual form data
    const mockConfig = {
      mode: currentMode!,
      numQuestions: 10,
      guestMode: false,
      selectedChordTypes: ['Major', 'Minor'],
    } as any;

    goToTraining(mockConfig);
  };

  const getModeTitle = () => {
    switch (currentMode) {
      case 'chord':
        return 'Chord Type Training';
      case 'interval':
        return 'Interval Training';
      case 'progression':
        return 'Chord Progression Training';
      default:
        return 'Configuration';
    }
  };

  return (
    <div className="config-screen">
      <h2>{getModeTitle()}</h2>
      <p className="config-subtitle">Configure your training session</p>

      <div className="config-content">
        <p className="placeholder-text">
          Configuration options will be implemented in Phase 2
        </p>
        <p className="placeholder-details">
          This screen will include checkboxes, selectors, and session options
        </p>
      </div>

      <div className="config-actions">
        <button className="secondary-button" onClick={goToMenu}>
          Back to Menu
        </button>
        <button className="primary-button" onClick={handleStartTraining}>
          Start Training
        </button>
      </div>
    </div>
  );
};

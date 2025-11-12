import { useApp } from '../../context/AppContext';
import { ChordTraining } from '../modes/chord';
import { IntervalTraining } from '../modes/interval';
import { ChordTypeConfig, IntervalConfig } from '../../types/screens';
import './TrainingScreen.css';

export const TrainingScreen = () => {
  const { sessionConfig } = useApp();

  if (!sessionConfig) {
    return (
      <div className="training-screen">
        <p>No session configuration found</p>
      </div>
    );
  }

  // Render mode-specific training component
  const renderModeTraining = () => {
    switch (sessionConfig.mode) {
      case 'chord':
        return <ChordTraining config={sessionConfig as ChordTypeConfig} />;
      case 'interval':
        return <IntervalTraining config={sessionConfig as IntervalConfig} />;
      case 'progression':
        return <div className="training-placeholder">Progression training coming soon...</div>;
      default:
        return <div className="training-placeholder">Unknown mode</div>;
    }
  };

  return (
    <div className="training-screen">
      {renderModeTraining()}
    </div>
  );
};

import { useApp } from '../../context/AppContext';
import { ChordConfig } from '../modes/chord';
import { IntervalConfig } from '../modes/interval';
import './ConfigScreen.css';

export const ConfigScreen = () => {
  const { currentMode } = useApp();

  // Render mode-specific configuration component
  const renderModeConfig = () => {
    switch (currentMode) {
      case 'chord':
        return <ChordConfig />;
      case 'interval':
        return <IntervalConfig />;
      case 'progression':
        return <div className="config-placeholder">Progression config coming soon...</div>;
      default:
        return <div className="config-placeholder">Unknown mode</div>;
    }
  };

  return (
    <div className="config-screen">
      {renderModeConfig()}
    </div>
  );
};

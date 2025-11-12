import { useAudio } from '../../context/AudioContext';
import { Button } from '../common';
import './InstrumentSelector.css';

interface InstrumentSelectorProps {
  disabled?: boolean;
}

export const InstrumentSelector = ({ disabled = false }: InstrumentSelectorProps) => {
  const { currentInstrument, toggleInstrument, isInitialized } = useAudio();

  const isPiano = currentInstrument === 'piano';

  return (
    <div className="instrument-selector">
      <Button
        variant="ghost"
        onClick={toggleInstrument}
        disabled={disabled || !isInitialized}
        className="instrument-toggle"
      >
        <span className={`instrument-icon ${isPiano ? 'active' : ''}`}>🎹</span>
        <span className="instrument-divider">/</span>
        <span className={`instrument-icon ${!isPiano ? 'active' : ''}`}>🎸</span>
        <span className="instrument-label">
          {isPiano ? 'Piano' : 'Guitar'}
        </span>
      </Button>
    </div>
  );
};

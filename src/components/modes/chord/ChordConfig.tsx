import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CHORD_TYPES } from '../../../audio/theory';
import { CheckboxGroup, CheckboxOption } from '../../config/CheckboxGroup';
import { SessionOptions } from '../../config/SessionOptions';
import { Button } from '../../common/Button';
import { ChordTypeConfig } from '../../../types/screens';
import './ChordConfig.css';

// Convert CHORD_TYPES to checkbox options
const chordTypeOptions: CheckboxOption[] = Object.keys(CHORD_TYPES).map((type) => ({
  value: type,
  label: type,
}));

export const ChordConfig = () => {
  const { goToMenu, goToTraining } = useApp();

  // Default to first two chord types selected
  const [selectedChordTypes, setSelectedChordTypes] = useState<string[]>([
    'Major',
    'Minor',
  ]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [guestMode, setGuestMode] = useState(false);

  const handleStartTraining = () => {
    const config: ChordTypeConfig = {
      mode: 'chord',
      selectedChordTypes,
      numQuestions,
      guestMode,
    };
    goToTraining(config);
  };

  return (
    <div className="chord-config">
      <div className="config-header">
        <h1>Chord Type Training</h1>
        <p className="config-description">
          Listen to a chord and identify its type. Select at least 2 chord types to begin training.
        </p>
      </div>

      <div className="config-content">
        <CheckboxGroup
          label="Select Chord Types"
          options={chordTypeOptions}
          selectedValues={selectedChordTypes}
          onChange={setSelectedChordTypes}
          minSelections={2}
        />

        <SessionOptions
          numQuestions={numQuestions}
          onNumQuestionsChange={setNumQuestions}
          guestMode={guestMode}
          onGuestModeChange={setGuestMode}
        />
      </div>

      <div className="config-actions">
        <Button variant="secondary" size="large" onClick={goToMenu}>
          Back to Menu
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={handleStartTraining}
          disabled={selectedChordTypes.length < 2}
        >
          Start Training
        </Button>
      </div>
    </div>
  );
};

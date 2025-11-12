import { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { INTERVALS } from '../../../audio/theory';
import { CheckboxGroup, CheckboxOption } from '../../config/CheckboxGroup';
import { SessionOptions } from '../../config/SessionOptions';
import { Button } from '../../common/Button';
import { IntervalConfig as IntervalConfigType } from '../../../types/screens';
import './IntervalConfig.css';

// Determine which intervals are compound (beyond one octave = 12 semitones)
const isCompoundInterval = (interval: string): boolean => {
  return INTERVALS[interval as keyof typeof INTERVALS] > 12;
};

export const IntervalConfig = () => {
  const { goToMenu, goToTraining } = useApp();

  // Default to first two intervals selected
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([
    'Perfect 5th',
    'Perfect 4th',
  ]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [guestMode, setGuestMode] = useState(false);
  const [direction, setDirection] = useState<'random' | 'ascending' | 'descending'>('random');
  const [harmonicMode, setHarmonicMode] = useState(false);
  const [compoundIntervals, setCompoundIntervals] = useState(false);
  const [octaveRange, setOctaveRange] = useState({ min: 3, max: 5 });

  // Filter intervals based on compound intervals setting
  const intervalOptions: CheckboxOption[] = useMemo(() => {
    return Object.keys(INTERVALS)
      .filter((interval) => compoundIntervals || !isCompoundInterval(interval))
      .map((interval) => ({
        value: interval,
        label: interval,
      }));
  }, [compoundIntervals]);

  // Remove compound intervals from selected if checkbox is unchecked
  const handleCompoundIntervalsChange = (checked: boolean) => {
    setCompoundIntervals(checked);
    if (!checked) {
      setSelectedIntervals((prev) =>
        prev.filter((interval) => !isCompoundInterval(interval))
      );
    }
  };

  const handleStartTraining = () => {
    const config: IntervalConfigType = {
      mode: 'interval',
      selectedIntervals,
      numQuestions,
      guestMode,
      direction,
      harmonicMode,
      compoundIntervals,
      octaveRange,
    };
    goToTraining(config);
  };

  return (
    <div className="interval-config">
      <div className="config-header">
        <h1>Interval Training</h1>
        <p className="config-description">
          Listen to two notes and identify the interval between them. Select at least 2 intervals to begin training.
        </p>
      </div>

      <div className="config-content">
        <CheckboxGroup
          label="Select Intervals"
          options={intervalOptions}
          selectedValues={selectedIntervals}
          onChange={setSelectedIntervals}
          minSelections={2}
        />

        <div className="config-section">
          <label className="config-label">Direction</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="random"
                checked={direction === 'random'}
                onChange={(e) => setDirection(e.target.value as 'random')}
              />
              <span>Random</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="ascending"
                checked={direction === 'ascending'}
                onChange={(e) => setDirection(e.target.value as 'ascending')}
              />
              <span>Ascending</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="descending"
                checked={direction === 'descending'}
                onChange={(e) => setDirection(e.target.value as 'descending')}
              />
              <span>Descending</span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">
            Octave Range
            <span className="help-text">Controls the range of the first note</span>
          </label>
          <div className="octave-range">
            <div className="range-input">
              <label>
                Min: {octaveRange.min}
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={octaveRange.min}
                  onChange={(e) =>
                    setOctaveRange({ ...octaveRange, min: parseInt(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="range-input">
              <label>
                Max: {octaveRange.max}
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={octaveRange.max}
                  onChange={(e) =>
                    setOctaveRange({ ...octaveRange, max: parseInt(e.target.value) })
                  }
                />
              </label>
            </div>
          </div>
        </div>

        <div className="config-section">
          <label className={`toggle-option ${harmonicMode ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={harmonicMode}
              onChange={(e) => setHarmonicMode(e.target.checked)}
            />
            <span className="toggle-content">
              <span className="toggle-label">Harmonic Mode</span>
              <span className="toggle-description">Play both notes simultaneously instead of melodically</span>
            </span>
          </label>
        </div>

        <div className="config-section">
          <label className={`toggle-option ${compoundIntervals ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={compoundIntervals}
              onChange={(e) => handleCompoundIntervalsChange(e.target.checked)}
            />
            <span className="toggle-content">
              <span className="toggle-label">Compound Intervals</span>
              <span className="toggle-description">Include intervals beyond one octave (9th, 10th, etc.)</span>
            </span>
          </label>
        </div>

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
          disabled={selectedIntervals.length < 2}
        >
          Start Training
        </Button>
      </div>
    </div>
  );
};

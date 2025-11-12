import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { getAvailableKeys } from '../../../audio/progressions';
import { SessionOptions } from '../../config/SessionOptions';
import { Button } from '../../common/Button';
import { ProgressionConfig as ProgressionConfigType } from '../../../types/screens';
import './ProgressionConfig.css';

export const ProgressionConfig = () => {
  const { goToMenu, goToTraining } = useApp();

  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [chordPool, setChordPool] = useState({ diatonic: true, nonDiatonic: false });
  const [key, setKey] = useState<string>('random');
  const [numQuestions, setNumQuestions] = useState(10);
  const [guestMode, setGuestMode] = useState(false);

  const availableKeys = getAvailableKeys();

  const handleStartTraining = () => {
    const config: ProgressionConfigType = {
      mode: 'progression',
      difficulty,
      chordPool,
      key,
      numQuestions,
      guestMode,
    };
    goToTraining(config);
  };

  const isChordPoolValid = chordPool.diatonic || chordPool.nonDiatonic;

  return (
    <div className="progression-config">
      <div className="config-header">
        <h1>Chord Progression Training</h1>
        <p className="config-description">
          Listen to a chord progression and identify the chords using Roman numerals.
          The key will be displayed before the progression plays.
        </p>
      </div>

      <div className="config-content">
        <div className="config-section">
          <label className="config-label">Difficulty</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="easy"
                checked={difficulty === 'easy'}
                onChange={(e) => setDifficulty(e.target.value as 'easy')}
              />
              <span>
                <strong>Easy</strong>
                <span className="help-text">2-4 chords per progression</span>
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="hard"
                checked={difficulty === 'hard'}
                onChange={(e) => setDifficulty(e.target.value as 'hard')}
              />
              <span>
                <strong>Hard</strong>
                <span className="help-text">5-8 chords per progression</span>
              </span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">Chord Pool</label>
          <p className="help-text">Select at least one option</p>

          <label className={`toggle-option ${chordPool.diatonic ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={chordPool.diatonic}
              onChange={(e) => setChordPool({ ...chordPool, diatonic: e.target.checked })}
            />
            <span className="toggle-content">
              <span className="toggle-label">Diatonic Chords</span>
              <span className="toggle-description">
                Chords naturally occurring in the key (I, ii, iii, IV, V, vi, vii° for major)
              </span>
            </span>
          </label>

          <label className={`toggle-option ${chordPool.nonDiatonic ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={chordPool.nonDiatonic}
              onChange={(e) => setChordPool({ ...chordPool, nonDiatonic: e.target.checked })}
            />
            <span className="toggle-content">
              <span className="toggle-label">Non-Diatonic Chords</span>
              <span className="toggle-description">
                Borrowed chords and secondary dominants (V7, V7/V, bVII, etc.)
              </span>
            </span>
          </label>
        </div>

        <div className="config-section">
          <label className="config-label">
            Key
            <span className="help-text">The key will be shown to you before each progression</span>
          </label>
          <select
            className="key-selector"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          >
            <option value="random">Random</option>
            <optgroup label="Major Keys">
              {availableKeys
                .filter((k) => !k.endsWith('m'))
                .map((k) => (
                  <option key={k} value={k}>
                    {k} Major
                  </option>
                ))}
            </optgroup>
            <optgroup label="Minor Keys">
              {availableKeys
                .filter((k) => k.endsWith('m'))
                .map((k) => (
                  <option key={k} value={k}>
                    {k.slice(0, -1)} Minor
                  </option>
                ))}
            </optgroup>
          </select>
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
          disabled={!isChordPoolValid}
        >
          Start Training
        </Button>
      </div>
    </div>
  );
};

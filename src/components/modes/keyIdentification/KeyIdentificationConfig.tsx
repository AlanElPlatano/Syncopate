import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SessionOptions } from '../../config/SessionOptions';
import { Button } from '../../common/Button';
import { KeyIdentificationConfig as KeyIdentificationConfigType, KeyMode } from '../../../types/screens';
import './KeyIdentificationConfig.css';

export const KeyIdentificationConfig = () => {
  const { goToMenu, goToTraining } = useApp();

  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [chordPool, setChordPool] = useState({ diatonic: true, nonDiatonic: false });
  const [keyMode, setKeyMode] = useState<KeyMode>('both');
  const [numQuestions, setNumQuestions] = useState(10);
  const [guestMode, setGuestMode] = useState(false);

  const handleStartTraining = () => {
    const config: KeyIdentificationConfigType = {
      mode: 'keyIdentification',
      difficulty,
      chordPool,
      keyMode,
      numQuestions,
      guestMode,
    };
    goToTraining(config);
  };

  const isChordPoolValid = chordPool.diatonic || chordPool.nonDiatonic;

  return (
    <div className="key-identification-config">
      <div className="config-header">
        <h1>Key Identification Training</h1>
        <p className="config-description">
          Listen to a chord progression and identify the key it is played in.
          The Roman numeral intervals will be shown as a hint.
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
          <label className="config-label">Key Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="both"
                checked={keyMode === 'both'}
                onChange={(e) => setKeyMode(e.target.value as KeyMode)}
              />
              <span>
                <strong>Major & Minor</strong>
                <span className="help-text">Questions will include both major and minor keys</span>
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="major"
                checked={keyMode === 'major'}
                onChange={(e) => setKeyMode(e.target.value as KeyMode)}
              />
              <span>
                <strong>Major Only</strong>
                <span className="help-text">All questions will be in major keys</span>
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="minor"
                checked={keyMode === 'minor'}
                onChange={(e) => setKeyMode(e.target.value as KeyMode)}
              />
              <span>
                <strong>Minor Only</strong>
                <span className="help-text">All questions will be in minor keys</span>
              </span>
            </label>
          </div>
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

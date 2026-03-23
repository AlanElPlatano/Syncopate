import { useState, useEffect } from 'react';
import { useAudio } from '../../../context/AudioContext';
import { useApp } from '../../../context/AppContext';
import { KeyIdentificationQuestion as KeyIdentificationQuestionType } from '../../../logic/keyIdentificationTraining';
import { MAJOR_KEYS, MINOR_KEYS, parseKey } from '../../../audio/progressions';
import { QuestionControls } from '../../training/QuestionControls';
import { InstrumentSelector } from '../../training/InstrumentSelector';
import { FeedbackDisplay, FeedbackType } from '../../training/FeedbackDisplay';
import { Button } from '../../common/Button';
import { KeyMode } from '../../../types/screens';
import './KeyIdentificationQuestion.css';

interface KeyIdentificationQuestionProps {
  question: KeyIdentificationQuestionType;
  keyMode: KeyMode;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onGiveUp: () => void;
  onNext: () => void;
  disabled?: boolean;
}

function getRootNotes(keys: string[]): string[] {
  return keys.map(k => parseKey(k).root);
}

export const KeyIdentificationQuestion = ({
  question,
  keyMode,
  onAnswer,
  onGiveUp,
  onNext,
  disabled = false,
}: KeyIdentificationQuestionProps) => {
  const { audioEngine, isInitialized } = useAudio();
  const { devInsightsEnabled } = useApp();
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedRoot, setSelectedRoot] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<'major' | 'minor'>('major');

  const availableRoots = keyMode === 'minor'
    ? getRootNotes(MINOR_KEYS)
    : getRootNotes(MAJOR_KEYS);

  const progressionDisplay = question.progression
    .map(chord => chord.label)
    .join(' - ');

  const correctKey = parseKey(question.key);
  const correctAnswerDisplay = `${correctKey.root} ${correctKey.mode === 'major' ? 'Major' : 'Minor'}`;

  useEffect(() => {
    if (isInitialized && audioEngine) {
      playProgression();
    }
  }, [question, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedRoot('');
    setSelectedQuality(keyMode === 'minor' ? 'minor' : 'major');
  }, [question, keyMode]);

  const playProgression = async () => {
    if (!audioEngine || isPlaying) return;

    setIsPlaying(true);
    try {
      await audioEngine.playProgression(question.chordNotes, question.bpm, '2n');
    } catch (error) {
      console.error('Error playing progression:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmit = () => {
    if (answered || disabled || !selectedRoot) return;

    const quality = keyMode === 'major' ? 'major'
      : keyMode === 'minor' ? 'minor'
      : selectedQuality;

    const isCorrect = correctKey.root === selectedRoot && correctKey.mode === quality;

    const userAnswerDisplay = `${selectedRoot} ${quality === 'major' ? 'Major' : 'Minor'}`;

    setAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onAnswer(userAnswerDisplay, isCorrect);
  };

  const handleGiveUp = () => {
    if (answered || disabled) return;

    setAnswered(true);
    setFeedback('gave-up');
    onGiveUp();
  };

  const handleNext = () => {
    setAnswered(false);
    setFeedback(null);
    setSelectedRoot('');
    setSelectedQuality(keyMode === 'minor' ? 'minor' : 'major');
    onNext();
  };

  const isSubmitEnabled = selectedRoot !== '' && !answered;

  return (
    <div className="key-identification-question">
      <div className="question-header">
        <InstrumentSelector disabled={isPlaying || disabled} />
      </div>

      <div className="question-content">
        <div className="question-prompt">
          <h2>What key is this progression in?</h2>
          <div className="progression-hint">
            <span className="hint-label">Progression:</span>
            <span className="hint-value">{progressionDisplay}</span>
          </div>
          <p className="question-instruction">
            Listen to the progression and identify the key
          </p>
          <p className="tempo-info">Tempo: {question.bpm} BPM</p>
        </div>

        <QuestionControls
          onReplay={playProgression}
          onGiveUp={handleGiveUp}
          isPlaying={isPlaying}
          disabled={disabled}
          disableGiveUp={answered}
        />

        <div className="answer-section">
          <div className="answer-dropdowns">
            <div className="dropdown-group">
              <label className="dropdown-label">Root Note</label>
              <select
                className="key-dropdown"
                value={selectedRoot}
                onChange={(e) => setSelectedRoot(e.target.value)}
                disabled={answered || disabled}
              >
                <option value="">Select...</option>
                {availableRoots.map((root) => (
                  <option key={root} value={root}>
                    {root}
                  </option>
                ))}
              </select>
            </div>

            {keyMode === 'both' ? (
              <div className="dropdown-group">
                <label className="dropdown-label">Quality</label>
                <select
                  className="key-dropdown"
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value as 'major' | 'minor')}
                  disabled={answered || disabled}
                >
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
            ) : (
              <div className="dropdown-group">
                <span className="quality-fixed">
                  {keyMode === 'major' ? 'Major' : 'Minor'}
                </span>
              </div>
            )}
          </div>

          {devInsightsEnabled && !answered && (
            <p className="dev-hint">Answer: {correctAnswerDisplay}</p>
          )}

          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
          >
            Submit Answer
          </Button>
        </div>

        <FeedbackDisplay
          feedback={feedback}
          correctAnswer={correctAnswerDisplay}
          showAnswer={feedback === 'incorrect' || feedback === 'gave-up'}
        />

        {answered && (
          <div className="next-question-section">
            <Button variant="primary" size="large" onClick={handleNext}>
              Next Question →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

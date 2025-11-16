import { useState, useEffect } from 'react';
import { useAudio } from '../../../context/AudioContext';
import { useApp } from '../../../context/AppContext';
import { ProgressionQuestion as ProgressionQuestionType } from '../../../logic/progressionTraining';
import { getDiatonicChords, getNonDiatonicChords, parseKey } from '../../../audio/progressions';
import { QuestionControls } from '../../training/QuestionControls';
import { InstrumentSelector } from '../../training/InstrumentSelector';
import { FeedbackDisplay, FeedbackType } from '../../training/FeedbackDisplay';
import { Button } from '../../common/Button';
import './ProgressionQuestion.css';

interface ProgressionQuestionProps {
  question: ProgressionQuestionType;
  chordPool: { diatonic: boolean; nonDiatonic: boolean };
  onAnswer: (answer: string[], isCorrect: boolean) => void;
  onGiveUp: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export const ProgressionQuestion = ({
  question,
  chordPool,
  onAnswer,
  onGiveUp,
  onNext,
  disabled = false,
}: ProgressionQuestionProps) => {
  const { audioEngine, isInitialized } = useAudio();
  const { devInsightsEnabled } = useApp();
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userProgression, setUserProgression] = useState<string[]>([]);

  const { mode } = parseKey(question.key);

  // Get available Roman numerals based on chord pool and key
  const availableNumerals = (() => {
    const diatonic = chordPool.diatonic ? getDiatonicChords(question.key) : [];
    const nonDiatonic = chordPool.nonDiatonic ? getNonDiatonicChords(question.key) : [];
    return [...diatonic, ...nonDiatonic];
  })();

  // Auto-play when question loads
  useEffect(() => {
    if (isInitialized && audioEngine) {
      playProgression();
    }
  }, [question, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAddChord = (numeral: string) => {
    if (answered || disabled) return;
    if (userProgression.length >= question.progression.length) return;

    setUserProgression([...userProgression, numeral]);
  };

  const handleRemoveLast = () => {
    if (answered || disabled || userProgression.length === 0) return;
    setUserProgression(userProgression.slice(0, -1));
  };

  const handleClear = () => {
    if (answered || disabled) return;
    setUserProgression([]);
  };

  const handleSubmit = () => {
    if (answered || disabled || userProgression.length !== question.progression.length) return;

    const correctAnswer = question.progression.map((chord) => chord.numeral);
    const isCorrect = userProgression.every((answer, index) => answer === correctAnswer[index]);

    setAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onAnswer(userProgression, isCorrect);
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
    setUserProgression([]);
    onNext();
  };

  const correctAnswer = question.progression.map((chord) => chord.label).join(' - ');
  const isSubmitEnabled = userProgression.length === question.progression.length && !answered;

  return (
    <div className="progression-question">
      <div className="question-header">
        <InstrumentSelector disabled={isPlaying || disabled} />
      </div>

      <div className="question-content">
        <div className="question-prompt">
          <h2>What progression do you hear?</h2>
          <div className="key-display">
            <span className="key-label">Key:</span>
            <span className="key-value">
              {parseKey(question.key).root} {mode === 'major' ? 'Major' : 'Minor'}
            </span>
          </div>
          <p className="question-instruction">
            Listen carefully and select the chords in order ({question.progression.length} chords)
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

        <div className="user-progression">
          <div className="progression-display">
            {userProgression.length === 0 ? (
              <span className="placeholder">Select chords below...</span>
            ) : (
              userProgression.map((numeral, index) => (
                <span key={index} className="progression-chord">
                  {numeral}
                </span>
              ))
            )}
          </div>
          <div className="progression-controls">
            <Button
              variant="secondary"
              size="small"
              onClick={handleRemoveLast}
              disabled={answered || disabled || userProgression.length === 0}
            >
              ← Remove Last
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={handleClear}
              disabled={answered || disabled || userProgression.length === 0}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleSubmit}
              disabled={!isSubmitEnabled}
            >
              Submit Answer
            </Button>
          </div>
        </div>

        <div className="numeral-options">
          <div className="numeral-grid">
            {availableNumerals.map((chord) => {
              // Sequential reveal: highlight only the next correct chord
              const nextCorrectIndex = userProgression.length;
              const nextCorrectChord = question.progression[nextCorrectIndex];
              const isNextCorrect = !answered && nextCorrectChord && chord.numeral === nextCorrectChord.numeral;
              // Visual aid for UI debugging - shows the next chord in sequence
              const showDevHint = devInsightsEnabled && isNextCorrect;

              return (
                <Button
                  key={chord.numeral}
                  variant="secondary"
                  size="medium"
                  onClick={() => handleAddChord(chord.numeral)}
                  disabled={answered || disabled || userProgression.length >= question.progression.length}
                  className={`numeral-button ${showDevHint ? 'dev-insights-hint' : ''}`}
                >
                  {chord.label}
                </Button>
              );
            })}
          </div>
        </div>

        <FeedbackDisplay
          feedback={feedback}
          correctAnswer={correctAnswer}
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
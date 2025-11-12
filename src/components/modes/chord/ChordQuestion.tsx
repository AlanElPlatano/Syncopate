import { useState, useEffect } from 'react';
import { useAudio } from '../../../context/AudioContext';
import { ChordQuestion as ChordQuestionType } from '../../../logic/chordTraining';
import { CHORD_TYPES } from '../../../audio/theory';
import { QuestionControls } from '../../training/QuestionControls';
import { InstrumentSelector } from '../../training/InstrumentSelector';
import { FeedbackDisplay, FeedbackType } from '../../training/FeedbackDisplay';
import { Button } from '../../common/Button';
import './ChordQuestion.css';

interface ChordQuestionProps {
  question: ChordQuestionType;
  selectedChordTypes: string[];
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onGiveUp: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export const ChordQuestion = ({
  question,
  selectedChordTypes,
  onAnswer,
  onGiveUp,
  onNext,
  disabled = false,
}: ChordQuestionProps) => {
  const { audioEngine, isInitialized } = useAudio();
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Auto-play when question loads
  useEffect(() => {
    if (isInitialized && audioEngine) {
      playChord();
    }
  }, [question, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  const playChord = async () => {
    if (!audioEngine || isPlaying) return;

    setIsPlaying(true);
    try {
      await audioEngine.playChord(question.chordNotes);
    } catch (error) {
      console.error('Error playing chord:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleAnswerClick = (selectedAnswer: string) => {
    if (answered || disabled) return;

    const isCorrect = selectedAnswer === question.chordType;
    setAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onAnswer(selectedAnswer, isCorrect);
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
    onNext();
  };

  return (
    <div className="chord-question">
      <div className="question-header">
        <InstrumentSelector disabled={isPlaying || disabled} />
      </div>

      <div className="question-content">
        <div className="question-prompt">
          <h2>What chord type do you hear?</h2>
          <p className="question-instruction">
            Listen carefully and select the chord type below
          </p>
        </div>

        <QuestionControls
          onReplay={playChord}
          onGiveUp={handleGiveUp}
          isPlaying={isPlaying}
          disabled={disabled || answered}
        />

        <div className="answer-options">
          {selectedChordTypes.map((chordType) => {
            const isSelected = answered && chordType === question.chordType;
            const isWrong = answered && feedback === 'incorrect' && chordType !== question.chordType;

            return (
              <Button
                key={chordType}
                variant={isSelected ? 'primary' : 'secondary'}
                size="large"
                onClick={() => handleAnswerClick(chordType)}
                disabled={answered || disabled}
                className={`answer-button ${isSelected ? 'correct-answer' : ''} ${
                  isWrong ? 'fade-out' : ''
                }`}
              >
                {chordType}
              </Button>
            );
          })}
        </div>

        <FeedbackDisplay
          feedback={feedback}
          correctAnswer={question.chordType}
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

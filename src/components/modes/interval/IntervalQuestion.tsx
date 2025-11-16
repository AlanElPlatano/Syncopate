import { useState, useEffect } from 'react';
import { useAudio } from '../../../context/AudioContext';
import { useApp } from '../../../context/AppContext';
import { IntervalQuestion as IntervalQuestionType } from '../../../logic/intervalTraining';
import { QuestionControls } from '../../training/QuestionControls';
import { InstrumentSelector } from '../../training/InstrumentSelector';
import { FeedbackDisplay, FeedbackType } from '../../training/FeedbackDisplay';
import { Button } from '../../common/Button';
import './IntervalQuestion.css';

interface IntervalQuestionProps {
  question: IntervalQuestionType;
  selectedIntervals: string[];
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onGiveUp: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export const IntervalQuestion = ({
  question,
  selectedIntervals,
  onAnswer,
  onGiveUp,
  onNext,
  disabled = false,
}: IntervalQuestionProps) => {
  const { audioEngine, isInitialized } = useAudio();
  const { devInsightsEnabled } = useApp();
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Auto-play when question loads
  useEffect(() => {
    if (isInitialized && audioEngine) {
      playInterval();
    }
  }, [question, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  const playInterval = async () => {
    if (!audioEngine || isPlaying) return;

    setIsPlaying(true);
    try {
      await audioEngine.playInterval(
        question.note1,
        question.note2,
        question.direction
      );
    } catch (error) {
      console.error('Error playing interval:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleAnswerClick = (selectedAnswer: string) => {
    if (answered || disabled) return;

    const isCorrect = selectedAnswer === question.intervalName;
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
    <div className="interval-question">
      <div className="question-header">
        <InstrumentSelector disabled={isPlaying || disabled} />
      </div>

      <div className="question-content">
        <div className="question-prompt">
          <h2>What interval do you hear?</h2>
          <p className="question-instruction">
            Listen carefully and identify the interval between the two notes
          </p>
        </div>

        <QuestionControls
          onReplay={playInterval}
          onGiveUp={handleGiveUp}
          isPlaying={isPlaying}
          disabled={disabled}
          disableGiveUp={answered}
        />

        <div className="answer-options">
          {selectedIntervals.map((interval) => {
            const isSelected = answered && interval === question.intervalName;
            const isWrong = answered && feedback === 'incorrect' && interval !== question.intervalName;
            const isCorrectAnswer = interval === question.intervalName;
            // Visual aid for UI debugging
            const showDevHint = devInsightsEnabled && !answered && isCorrectAnswer;

            return (
              <Button
                key={interval}
                variant={isSelected ? 'primary' : 'secondary'}
                size="large"
                onClick={() => handleAnswerClick(interval)}
                disabled={answered || disabled}
                className={`answer-button ${isSelected ? 'correct-answer' : ''} ${
                  isWrong ? 'fade-out' : ''
                } ${showDevHint ? 'dev-insights-hint' : ''}`}
              >
                {interval}
              </Button>
            );
          })}
        </div>

        <FeedbackDisplay
          feedback={feedback}
          correctAnswer={question.intervalName}
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
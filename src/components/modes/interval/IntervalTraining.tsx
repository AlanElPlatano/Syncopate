import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { IntervalConfig } from '../../../types/screens';
import { SessionStats } from '../../../types/stats';
import { generateIntervalQuestion, IntervalQuestion as IntervalQuestionType } from '../../../logic/intervalTraining';
import { IntervalQuestion } from './IntervalQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import './IntervalTraining.css';

interface IntervalTrainingProps {
  config: IntervalConfig;
}

export const IntervalTraining = ({ config }: IntervalTrainingProps) => {
  const { goToStats } = useApp();
  const { recordSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<IntervalQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate all questions on mount
  useEffect(() => {
    const generatedQuestions: IntervalQuestionType[] = [];
    for (let i = 0; i < config.numQuestions; i++) {
      try {
        generatedQuestions.push(
          generateIntervalQuestion(
            config.selectedIntervals,
            config.direction,
            config.harmonicMode,
            config.compoundIntervals,
            config.octaveRange
          )
        );
      } catch (error) {
        console.error('Error generating interval question:', error);
      }
    }
    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, [config]);

  const handleAnswer = (_answer: string, isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleGiveUp = () => {
    // Give up doesn't count as correct, but we don't do anything special
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      // Session complete so record stats and go to stats screen
      finishSession();
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const finishSession = () => {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    const sessionStats: SessionStats = {
      mode: 'interval',
      correctAnswers,
      totalQuestions: questions.length,
      accuracy,
      timestamp: Date.now(),
    };

    recordSession(sessionStats, config.guestMode);
    goToStats();
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="interval-training">
        <Card>
          <div className="training-loading">
            <p>Generating questions...</p>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="interval-training">
      <QuestionCounter
        current={currentQuestionIndex + 1}
        total={questions.length}
        mode="Interval Training"
      />

      <Card>
        <IntervalQuestion
          question={currentQuestion}
          selectedIntervals={config.selectedIntervals}
          onAnswer={handleAnswer}
          onGiveUp={handleGiveUp}
          onNext={handleNext}
        />
      </Card>
    </div>
  );
};

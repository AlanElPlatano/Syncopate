import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { ProgressionConfig } from '../../../types/screens';
import { SessionStats } from '../../../types/stats';
import {
  generateProgressionQuestion,
  ProgressionQuestion as ProgressionQuestionType,
} from '../../../logic/progressionTraining';
import { ProgressionQuestion } from './ProgressionQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import './ProgressionTraining.css';

interface ProgressionTrainingProps {
  config: ProgressionConfig;
}

export const ProgressionTraining = ({ config }: ProgressionTrainingProps) => {
  const { goToStats } = useApp();
  const { recordSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<ProgressionQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate all questions on mount
  useEffect(() => {
    const generatedQuestions: ProgressionQuestionType[] = [];
    for (let i = 0; i < config.numQuestions; i++) {
      generatedQuestions.push(
        generateProgressionQuestion(config.difficulty, config.chordPool, config.key)
      );
    }
    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, [config]);

  const handleAnswer = (_answer: string[], isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleGiveUp = () => {
    // Give up doesn't count as correct
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      // Session complete, record stats and go to stats screen
      finishSession();
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const finishSession = () => {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    const sessionStats: SessionStats = {
      mode: 'progression',
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
      <div className="progression-training">
        <Card>
          <div className="training-loading">
            <p>Generating progressions...</p>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="progression-training">
      <QuestionCounter
        current={currentQuestionIndex + 1}
        total={questions.length}
        mode="Chord Progression Training"
      />

      <Card>
        <ProgressionQuestion
          question={currentQuestion}
          chordPool={config.chordPool}
          onAnswer={handleAnswer}
          onGiveUp={handleGiveUp}
          onNext={handleNext}
        />
      </Card>
    </div>
  );
};

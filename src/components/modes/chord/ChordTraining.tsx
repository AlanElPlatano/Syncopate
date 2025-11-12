import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { ChordTypeConfig } from '../../../types/screens';
import { SessionStats } from '../../../types/stats';
import { generateChordQuestion, ChordQuestion as ChordQuestionType } from '../../../logic/chordTraining';
import { ChordQuestion } from './ChordQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import './ChordTraining.css';

interface ChordTrainingProps {
  config: ChordTypeConfig;
}

export const ChordTraining = ({ config }: ChordTrainingProps) => {
  const { goToStats } = useApp();
  const { recordSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<ChordQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate all questions on mount
  useEffect(() => {
    const generatedQuestions: ChordQuestionType[] = [];
    for (let i = 0; i < config.numQuestions; i++) {
      generatedQuestions.push(generateChordQuestion(config.selectedChordTypes));
    }
    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, [config]);

  const handleAnswer = (answer: string, isCorrect: boolean) => {
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
      mode: 'chord',
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
      <div className="chord-training">
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
    <div className="chord-training">
      <QuestionCounter
        current={currentQuestionIndex + 1}
        total={questions.length}
        mode="Chord Type Training"
      />

      <Card>
        <ChordQuestion
          question={currentQuestion}
          selectedChordTypes={config.selectedChordTypes}
          onAnswer={handleAnswer}
          onGiveUp={handleGiveUp}
          onNext={handleNext}
        />
      </Card>
    </div>
  );
};

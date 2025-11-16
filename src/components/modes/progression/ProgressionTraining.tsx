import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { ProgressionConfig } from '../../../types/screens';
import { ProgressionAnswerRecord, DetailedSessionStats } from '../../../types/stats';
import {
  generateProgressionQuestion,
  ProgressionQuestion as ProgressionQuestionType,
} from '../../../logic/progressionTraining';
import { ProgressionQuestion } from './ProgressionQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import { generateSessionId } from '../../../utils/storage';
import './ProgressionTraining.css';

interface ProgressionTrainingProps {
  config: ProgressionConfig;
}

export const ProgressionTraining = ({ config }: ProgressionTrainingProps) => {
  const { goToStats } = useApp();
  const { recordDetailedSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<ProgressionQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<ProgressionAnswerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(() => Date.now()); // Capture start time on mount

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

  const handleAnswer = (answer: string[], isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Record detailed answer data
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.progression.map(chord => chord.numeral);
    const answerRecord: ProgressionAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect,
      correctAnswer,
      userAnswer: answer,
      key: currentQuestion.key,
      progressionLength: currentQuestion.progression.length,
      bpm: currentQuestion.bpm,
      difficulty: config.difficulty,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
  };

  const handleGiveUp = () => {
    // Give up doesn't count as correct, but we record it as an incorrect answer
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.progression.map(chord => chord.numeral);
    const answerRecord: ProgressionAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect: false,
      correctAnswer,
      userAnswer: [], // Empty array indicates gave up
      key: currentQuestion.key,
      progressionLength: currentQuestion.progression.length,
      bpm: currentQuestion.bpm,
      difficulty: config.difficulty,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
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
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;

    const sessionStats: DetailedSessionStats = {
      sessionId: generateSessionId(),
      mode: 'progression',
      correctAnswers,
      totalQuestions: questions.length,
      accuracy,
      timestamp: sessionEndTime,
      sessionStartTime,
      sessionEndTime,
      duration,
      answers: answerRecords,
      config: {
        guestMode: config.guestMode,
        numQuestions: config.numQuestions,
        difficulty: config.difficulty,
        chordPool: config.chordPool,
        key: config.key,
      },
    };

    recordDetailedSession(sessionStats, config.guestMode);
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

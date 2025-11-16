import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { IntervalConfig } from '../../../types/screens';
import { IntervalAnswerRecord, DetailedSessionStats } from '../../../types/stats';
import { generateIntervalQuestion, IntervalQuestion as IntervalQuestionType } from '../../../logic/intervalTraining';
import { IntervalQuestion } from './IntervalQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import { generateSessionId } from '../../../utils/storage';
import './IntervalTraining.css';

interface IntervalTrainingProps {
  config: IntervalConfig;
}

export const IntervalTraining = ({ config }: IntervalTrainingProps) => {
  const { goToStats } = useApp();
  const { recordDetailedSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<IntervalQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<IntervalAnswerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(() => Date.now()); // Capture start time on mount

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

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Record detailed answer data
    const currentQuestion = questions[currentQuestionIndex];
    const answerRecord: IntervalAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect,
      correctAnswer: currentQuestion.intervalName,
      userAnswer: answer,
      intervalName: currentQuestion.intervalName,
      direction: currentQuestion.direction,
      note1: currentQuestion.note1,
      note2: currentQuestion.note2,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
  };

  const handleGiveUp = () => {
    // Give up doesn't count as correct, but we record it as an incorrect answer
    const currentQuestion = questions[currentQuestionIndex];
    const answerRecord: IntervalAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect: false,
      correctAnswer: currentQuestion.intervalName,
      userAnswer: '', // Empty string indicates gave up
      intervalName: currentQuestion.intervalName,
      direction: currentQuestion.direction,
      note1: currentQuestion.note1,
      note2: currentQuestion.note2,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
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
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;

    const sessionStats: DetailedSessionStats = {
      sessionId: generateSessionId(),
      mode: 'interval',
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
        selectedIntervals: config.selectedIntervals,
        direction: config.direction,
        harmonicMode: config.harmonicMode,
        compoundIntervals: config.compoundIntervals,
        octaveRange: config.octaveRange,
      },
    };

    recordDetailedSession(sessionStats, config.guestMode);
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

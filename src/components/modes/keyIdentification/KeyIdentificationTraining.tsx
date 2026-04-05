import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useStats } from '../../../context/StatsContext';
import { KeyIdentificationConfig } from '../../../types/screens';
import { KeyIdentificationAnswerRecord, DetailedSessionStats } from '../../../types/stats';
import {
  generateKeyIdentificationQuestion,
  KeyIdentificationQuestion as KeyIdentificationQuestionType,
  formatKeyDisplay,
} from '../../../logic/keyIdentificationTraining';
import { KeyIdentificationQuestion } from './KeyIdentificationQuestion';
import { QuestionCounter } from '../../training/QuestionCounter';
import { Card } from '../../common/Card';
import { generateSessionId } from '../../../utils/storage';
import './KeyIdentificationTraining.css';

interface KeyIdentificationTrainingProps {
  config: KeyIdentificationConfig;
}

export const KeyIdentificationTraining = ({ config }: KeyIdentificationTrainingProps) => {
  const { goToStats } = useApp();
  const { recordDetailedSession } = useStats();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<KeyIdentificationQuestionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<KeyIdentificationAnswerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(() => Date.now());

  useEffect(() => {
    const generatedQuestions: KeyIdentificationQuestionType[] = [];
    for (let i = 0; i < config.numQuestions; i++) {
      generatedQuestions.push(
        generateKeyIdentificationQuestion(config.difficulty, config.chordPool, config.keyMode)
      );
    }
    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, [config]);

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answerRecord: KeyIdentificationAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect,
      correctAnswer: formatKeyDisplay(currentQuestion.key),
      userAnswer: answer,
      progression: currentQuestion.progression.map(chord => chord.numeral),
      progressionLength: currentQuestion.progression.length,
      bpm: currentQuestion.bpm,
      difficulty: config.difficulty,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
  };

  const handleGiveUp = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answerRecord: KeyIdentificationAnswerRecord = {
      questionIndex: currentQuestionIndex,
      timestamp: Date.now(),
      isCorrect: false,
      correctAnswer: formatKeyDisplay(currentQuestion.key),
      userAnswer: '',
      progression: currentQuestion.progression.map(chord => chord.numeral),
      progressionLength: currentQuestion.progression.length,
      bpm: currentQuestion.bpm,
      difficulty: config.difficulty,
    };

    setAnswerRecords((prev) => [...prev, answerRecord]);
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
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
      mode: 'keyIdentification',
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
        keyMode: config.keyMode,
      },
    };

    recordDetailedSession(sessionStats, config.guestMode);
    goToStats();
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="key-identification-training">
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
    <div className="key-identification-training">
      <QuestionCounter
        current={currentQuestionIndex + 1}
        total={questions.length}
        mode="Key Identification Training"
      />

      <Card>
        <KeyIdentificationQuestion
          question={currentQuestion}
          keyMode={config.keyMode}
          onAnswer={handleAnswer}
          onGiveUp={handleGiveUp}
          onNext={handleNext}
        />
      </Card>
    </div>
  );
};

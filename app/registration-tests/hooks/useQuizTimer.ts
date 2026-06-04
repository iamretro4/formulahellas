
import { useState, useEffect } from 'react';
import { QuizStatus } from '../types';

export const useQuizTimer = (startTime?: Date, endTime?: Date) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getQuizStatus = (): QuizStatus => {
    if (!startTime || !endTime) return QuizStatus.PENDING;
    if (now < startTime) return QuizStatus.PENDING;
    if (now >= startTime && now < endTime) return QuizStatus.ACTIVE;
    return QuizStatus.FINISHED;
  };

  const quizStatus = getQuizStatus();

  const getTimeRemaining = (): number => {
    if (!endTime || quizStatus !== QuizStatus.ACTIVE) return 0;
    return Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
  };
  
  const timeRemaining = getTimeRemaining();

  return { quizStatus, timeRemaining };
};

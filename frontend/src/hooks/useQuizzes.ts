import { useState, useEffect } from 'react';
import { quizService } from '../lib/api';

export interface QuizQuestion {
  id: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
}

export interface Quiz {
  id: number;
  title: string;
  category?: string;
  description?: string;
  questions?: QuizQuestion[];
}

export interface QuizResponse {
  questionId: number;
  response: string;
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllQuizzes() as Quiz[];
      setQuizzes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQuizById = async (quizId: string) => {
    try {
      const data = await quizService.getQuizById(quizId);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quiz');
      throw err;
    }
  };

  const submitQuiz = async (quizId: string, userId: string, responses: QuizResponse[], timeTaken: number) => {
    try {
      const result = await quizService.submitQuiz(quizId, userId, responses, timeTaken);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
      throw err;
    }
  };

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    getQuizById,
    submitQuiz,
  };
}

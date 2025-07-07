import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizQuestion from '../components/QuizQuestion';
import '../styles/QuizPage.css';

const QuizPage = () => {
  const { id } = useParams(); // quiz ID from URL
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8090/quiz/get/${id}`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Error fetching quiz questions:", err));
  }, [id]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setResponses(prev => {
      const updated = prev.filter(r => r.id !== questionId);
      return [...updated, { id: questionId, response: selectedOption }];
    });
  };

  const handleSubmit = () => {
    axios.post(`http://localhost:8090/quiz/submit/${id}`, responses)
      .then(res => setScore(res.data))
      .catch(err => console.error("Error submitting quiz:", err));
  };

  return (
    <div className="quiz-page">

      {questions.map((q, i) => (
        <QuizQuestion
          key={q.id}
          question={q}
          index={i}
          onAnswerSelect={handleAnswerSelect}
        />
      ))}

        <button
            onClick={handleSubmit}
            className="submit-button"
        >
            Submit Quiz
        </button>

      {score !== null && (
        <div className="score-display">
          Your Score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
};

export default QuizPage;

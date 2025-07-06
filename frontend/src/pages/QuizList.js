import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuizBox from '../components/QuizBox';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8090/quiz/all')
      .then(response => setQuizzes(response.data))
      .catch(error => console.error("Error fetching quizzes:", error));
  }, []);

  const handleAttemptQuiz = (quizId) => {
    console.log("Attempt quiz:", quizId);
    // Navigation logic here
  };

  return (
    <div className="quiz-page">
      <h1 className="quiz-heading">Available Quizzes</h1>
      <div className="quiz-grid">
        {quizzes.map(quiz => (
          <QuizBox key={quiz.id} quiz={quiz} onAttempt={handleAttemptQuiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizList;

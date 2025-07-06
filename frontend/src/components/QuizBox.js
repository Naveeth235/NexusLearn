import React from 'react';
import './QuizBox.css';

const QuizBox = ({ quiz, onAttempt }) => {
  return (
    <div className="quiz-box">
      <h2 className="quiz-title">{quiz.title}</h2>
      <p className="quiz-info">
        Number of Questions: {quiz.questionIds.length}
      </p>
      <button className="quiz-button" onClick={() => onAttempt(quiz.id)}>
        Attempt Quiz
      </button>
    </div>
  );
};

export default QuizBox;

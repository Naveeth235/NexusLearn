import React from 'react';
import '../styles/QuizQuestion.css'; // <-- import this

const QuizQuestion = ({ question, index, onAnswerSelect }) => {
  return (
    <div className="question-box">
      <h3 className="question-title">
        Q{index + 1} : {question.questionTitle}   (01 marks)
      </h3>
      <div>
        {[question.option1, question.option2, question.option3, question.option4].map((option, i) => (
          <label key={i} className="option-label">
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              onChange={() => onAnswerSelect(question.id, option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;

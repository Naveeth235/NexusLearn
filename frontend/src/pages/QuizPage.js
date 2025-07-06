import React from 'react';
import { useParams } from 'react-router-dom';

const QuizPage = () => {
    const { id } = useParams();

    return (
        <div style={{ padding: 20 }}>
            <h2>Quiz Attempt Page</h2>
            <p>Quiz ID: {id}</p>
            {/* Fetch quiz questions by id and render quiz here */}
        </div>
    );
};

export default QuizPage;

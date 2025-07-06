import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './pages/QuizList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/quizzes" element={<QuizList />} />
      </Routes>
    </Router>
  );
}

export default App;

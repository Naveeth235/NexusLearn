import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './pages/QuizList';
import QuizPage from './pages/QuizPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

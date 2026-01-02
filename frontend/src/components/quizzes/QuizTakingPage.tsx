import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { quizService, questionService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Question {
  id: number;
  questionId?: number; // For backward compatibility
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  options?: string[]; // Computed field
  rightAnswer: string;
  correctAnswer?: number; // Computed field
  explanation?: string;
}

interface Quiz {
  id: number;
  quizId?: number;
  title: string;
  category: string;
  description: string;
  difficultyLevel: string;
  timeLimit: number;
  passingScore: number;
  questionIds: number[];
}

interface QuizAttempt {
  attemptId: number;
  score?: number;
  passed?: boolean;
}

export function QuizTakingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [startTime] = useState(Date.now());

  // Fetch quiz and questions
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizData = await quizService.getQuizById(id) as Quiz;
        console.log('Quiz data:', quizData);
        setQuiz(quizData);
        
        // Fetch all questions for this quiz
        const allQuestions = await questionService.getAllQuestions() as Question[];
        console.log('All questions:', allQuestions);
        console.log('Quiz question IDs:', quizData.questionIds);
        
        const quizQuestions = allQuestions
          .filter((q: any) => quizData.questionIds.includes(q.id || q.questionId))
          .map((q: any) => ({
            ...q,
            options: [q.option1, q.option2, q.option3, q.option4]
          }));
        
        console.log('Filtered quiz questions:', quizQuestions);
        
        setQuestions(quizQuestions);
        
        // Initialize answers and timer
        setUserAnswers(new Array(quizQuestions.length).fill(null));
        if (quizData.timeLimit) {
          setTimeRemaining(quizData.timeLimit * 60); // Convert to seconds
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">{error || "Quiz not found"}</h2>
          <Link to="/quizzes" className="text-[#1935ca] hover:underline">
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">No questions available for this quiz</h2>
          <Link to="/quizzes" className="text-[#1935ca] hover:underline">
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const answeredCount = userAnswers.filter(a => a !== null).length;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    try {
      // Get userId from user object or localStorage
      const userId = user.id || localStorage.getItem('userId');
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }
      
      // Calculate time taken in seconds
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      // Prepare responses in the format expected by backend
      // Send the actual option text, not the option number
      const responses = questions.map((question, index) => {
        const answerIndex = userAnswers[index];
        if (answerIndex === null) {
          return { id: question.id, response: "" };
        }
        // Get the actual option text from the question
        const optionText = question.options?.[answerIndex] || "";
        return { id: question.id, response: optionText };
      });
      
      console.log('Submitting quiz:', {
        quizId: quiz.id,
        userId: userId,
        responses,
        timeTaken
      });
      
      // Submit to backend
      const attempt = await quizService.submitQuiz(
        quiz.id.toString(),
        userId.toString(),
        responses,
        timeTaken
      ) as QuizAttempt;
      
      console.log('Quiz submitted, attempt:', attempt);
      
      // Navigate to results with attempt ID
      navigate(`/quiz/${quiz.id}/results/${attempt.attemptId}`);
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      setError(err.message || "Failed to submit quiz");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/quizzes" 
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Quizzes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1935ca] mb-1">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.category}</p>
          </div>
          {timeRemaining !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="size-5" />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#1935CA] h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
        {/* Question */}
        <h2 className="text-gray-800 mb-6">{currentQuestionData.questionTitle}</h2>

        {/* Options */}
        <div className="space-y-3">
          {(currentQuestionData.options || []).map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                userAnswers[currentQuestion] === index
                  ? 'border-[#1935CA] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                  userAnswers[currentQuestion] === index
                    ? 'border-[#1935CA] bg-[#1935CA]'
                    : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion] === index && (
                    <div className="size-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-700">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="size-4" />
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            Next
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-800 mb-4">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`aspect-square rounded-lg text-sm transition-colors ${
                currentQuestion === index
                  ? 'bg-[#1935CA] text-white'
                  : userAnswers[index] !== null
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-gray-800 mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-2">
              You have answered {answeredCount} out of {questions.length} questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-orange-600 mb-6">
                {questions.length - answeredCount} question(s) remain unanswered and will be marked as incorrect.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="flex-1 px-4 py-2 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

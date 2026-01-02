import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Trophy, XCircle, CheckCircle, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { quizService, questionService } from "../../lib/api";

interface QuizAttempt {
  attemptId: string;
  quizId: string;
  studentId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  attemptedAt: string;
  userResponses: {
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

interface Quiz {
  id: number;
  title: string;
  category: string;
  description: string;
  difficultyLevel: string;
  timeLimit: number;
  passingScore: number;
  questionIds: number[];
}

interface Question {
  id: number;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  rightAnswer: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

export function QuizResultsPage() {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!attemptId) {
        navigate("/quizzes");
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch attempt details
        const attemptData = await quizService.getQuizAttempt(attemptId);
        setAttempt(attemptData);
        
        // Fetch quiz details
        const quizData = await quizService.getQuizById(attemptData.quizId);
        setQuiz(quizData);
        
        // Fetch questions
        const allQuestions = await questionService.getAllQuestions();
        const quizQuestions = allQuestions
          .filter((q: any) => quizData.questionIds.includes(q.id))
          .map((q: any) => {
            const options = [q.option1, q.option2, q.option3, q.option4];
            // Find which option index matches the rightAnswer
            const correctAnswer = options.findIndex(opt => opt === q.rightAnswer);
            return {
              ...q,
              options,
              correctAnswer: correctAnswer !== -1 ? correctAnswer : 0
            };
          });
        setQuestions(quizQuestions);
        
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError(err.message || "Failed to load results");
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt || !quiz) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">{error || "Results not found"}</h2>
          <Link to="/quizzes" className="text-[#1935ca] hover:underline">
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  const passed = attempt.score >= quiz.passingScore;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <Link 
        to="/quizzes" 
        className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-6"
      >
        <ArrowLeft className="size-4" />
        Back to Quizzes
      </Link>

      {/* Score Card */}
      <div className={`rounded-xl p-8 mb-8 text-center ${
        passed 
          ? 'bg-gradient-to-r from-green-500 to-green-600' 
          : 'bg-gradient-to-r from-orange-500 to-orange-600'
      }`}>
        <div className="text-white mb-4">
          <Trophy className="size-16 mx-auto mb-4" />
          <h1 className="text-white mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-white/90 mb-6">{quiz.title}</p>
        </div>

        {/* Score Display */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="text-6xl text-white mb-2">{attempt.score}%</div>
          <p className="text-white/90">Your Score</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl text-white mb-1">{attempt.correctAnswers}</div>
            <p className="text-sm text-white/90">Correct</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl text-white mb-1">{attempt.totalQuestions - attempt.correctAnswers}</div>
            <p className="text-sm text-white/90">Incorrect</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl text-white mb-1">{attempt.totalQuestions}</div>
            <p className="text-sm text-white/90">Total</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl text-white mb-1">
              <Clock className="size-6 mx-auto mb-1" />
            </div>
            <p className="text-sm text-white/90">{formatTime(attempt.timeTaken)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <Link
            to={`/quiz/${quiz.id}/take`}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="size-4" />
            Retake Quiz
          </Link>
          <Link
            to="/quiz-history"
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white/30 transition-colors"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-[#1935ca] mb-6">Detailed Breakdown</h2>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userResponse = attempt.userResponses.find(r => r.questionId === question.id);
            const isCorrect = userResponse?.isCorrect || false;
            // selectedAnswer is now the text of the answer, not the index
            const userAnswerText = userResponse?.selectedAnswer || "";
            const userAnswerIndex = question.options.findIndex(opt => opt === userAnswerText);

            return (
              <div 
                key={question.id}
                className={`p-6 rounded-lg border-2 ${
                  isCorrect 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="size-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        Question {index + 1}
                      </span>
                      <span className={`text-sm ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <h3 className="text-gray-800">{question.questionTitle}</h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswerIndex === optionIndex;
                    const isCorrectAnswer = question.correctAnswer === optionIndex;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg ${
                          isCorrectAnswer
                            ? 'bg-green-100 border-2 border-green-500'
                            : isUserAnswer
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectAnswer && (
                            <CheckCircle className="size-5 text-green-600" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <XCircle className="size-5 text-red-600" />
                          )}
                          <span className={`${
                            isCorrectAnswer ? 'text-green-800' :
                            isUserAnswer ? 'text-red-800' : 'text-gray-700'
                          }`}>
                            {option}
                          </span>
                          {isCorrectAnswer && (
                            <span className="ml-auto text-sm text-green-700">
                              Correct Answer
                            </span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="ml-auto text-sm text-red-700">
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}

                {/* No answer selected */}
                {userAnswerIndex === -1 && (
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      You did not answer this question.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 justify-center mt-8">
        <Link
          to={`/quiz/${quiz.id}/take`}
          className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
        >
          <RefreshCw className="size-4" />
          Retake Quiz
        </Link>
        <Link
          to="/quizzes"
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
}

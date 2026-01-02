import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Trophy, Clock, Eye, TrendingUp, Target, Brain } from "lucide-react";
import { quizService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface QuizAttempt {
  attemptId: string;
  quizId: string;
  studentId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  attemptedAt: string;
}

interface Quiz {
  id: number;
  title: string;
}

type SortBy = "date" | "score";

export function QuizHistoryPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      // Get userId from user object or localStorage
      const userId = user?.id || localStorage.getItem('userId');
      
      if (!userId) {
        setLoading(false);
        setError("User information not available. Please log in again.");
        return;
      }
      
      try {
        setLoading(true);
        // Fetch both history and all quizzes
        const [history, allQuizzes] = await Promise.all([
          quizService.getQuizHistory(userId.toString()),
          quizService.getAllQuizzes()
        ]);
        setAttempts(history as QuizAttempt[]);
        setQuizzes(allQuizzes as Quiz[]);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz history:", err);
        setError(err.message || "Failed to load quiz history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">{error}</h2>
          <Link to="/quizzes" className="text-[#1935ca] hover:underline">
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  // Sort quiz history
  const sortedHistory = [...attempts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime();
      case "score":
        return b.score - a.score;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalQuizzes = attempts.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalQuizzes)
    : 0;
  const passedQuizzes = attempts.filter(attempt => attempt.score >= 70).length;
  const highestScore = totalQuizzes > 0 
    ? Math.max(...attempts.map(attempt => attempt.score))
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id.toString() === quizId);
    return quiz ? quiz.title : `Quiz #${quizId}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Quiz History</h1>
        <p className="text-gray-600">Track your progress and review past attempts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Brain className="size-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
          <p className="text-[#1935ca]">{totalQuizzes}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="size-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Average Score</p>
          <p className="text-[#1935ca]">{avgScore}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="size-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Passed Quizzes</p>
          <p className="text-[#1935ca]">{passedQuizzes}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="size-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Highest Score</p>
          <p className="text-[#1935ca]">{highestScore}%</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("date")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortBy === "date"
                  ? "bg-[#1935CA] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setSortBy("score")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortBy === "score"
                  ? "bg-[#1935CA] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Score
            </button>
          </div>
        </div>
      </div>

      {/* Quiz History Table/Cards */}
      {sortedHistory.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Quiz ID</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Date Taken</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Score</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Time</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedHistory.map((attempt) => (
                  <tr key={attempt.attemptId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-800">{getQuizTitle(attempt.quizId)}</div>
                      <div className="text-sm text-gray-500">
                        {attempt.totalQuestions} questions
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="size-4" />
                        <span className="text-sm">{formatDate(attempt.attemptedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          attempt.score >= 80
                            ? "bg-green-100 text-green-700"
                            : attempt.score >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {attempt.score}%
                        </span>
                        {attempt.score >= 70 && (
                          <Trophy className="size-4 text-green-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="size-4" />
                        <span className="text-sm">{formatTime(attempt.timeTaken)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/quiz/${attempt.quizId}/results/${attempt.attemptId}`}
                        className="inline-flex items-center gap-2 text-[#1935ca] hover:underline text-sm"
                      >
                        <Eye className="size-4" />
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {sortedHistory.map((attempt) => (
              <div 
                key={attempt.attemptId}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-1">{getQuizTitle(attempt.quizId)}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">
                        {attempt.totalQuestions} questions
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm flex-shrink-0 ${
                    attempt.score >= 80
                      ? "bg-green-100 text-green-700"
                      : attempt.score >= 70
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {attempt.score}%
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>{formatDate(attempt.attemptedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>{formatTime(attempt.timeTaken)}</span>
                  </div>
                </div>

                <Link
                  to={`/quiz/${attempt.quizId}/results/${attempt.attemptId}`}
                  className="block w-full text-center px-4 py-2 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
                >
                  View Results
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Brain className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No quiz history yet</h3>
          <p className="text-gray-500 mb-4">
            Start taking quizzes to track your progress
          </p>
          <Link 
            to="/quizzes"
            className="inline-block bg-[#1935CA] text-white px-6 py-2 rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            Browse Quizzes
          </Link>
        </div>
      )}
    </div>
  );
}

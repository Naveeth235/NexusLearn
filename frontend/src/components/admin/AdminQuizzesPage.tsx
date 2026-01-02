import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Edit, Trash2, Clock, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { quizService } from "../../lib/api";

const categories = ["All Categories", "Data Structure", "Cyber Security", "Cloud Computing", "Network Security"];

interface Quiz {
  id: number;
  title: string;
  description?: string;
  category: string;
  difficultyLevel: string;
  timeLimit: number;
  passingScore: number;
  createdAt?: string;
}

export function AdminQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch quizzes
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getAllQuizzes();
      setQuizzes(data as Quiz[]);
    } catch (err) {
      setError('Failed to load quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(quizId);
      await quizService.deleteQuiz(quizId.toString());
      // Refresh the quiz list after successful deletion
      fetchQuizzes();
      alert('Quiz deleted successfully');
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || quiz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            <p>Failed to load quizzes. Please try again later.</p>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[#1935ca] mb-2">Manage Quizzes</h1>
          <p className="text-gray-600">Create, edit, and manage all quizzes</p>
        </div>
        
        {/* Create Quiz Button */}
        <Link
          to="/admin/quiz/create"
          className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
        >
          <Plus className="size-5" />
          Add New Quiz
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
        </div>
      </div>

      {/* Quizzes Table/Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quiz Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time Limit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pass Score</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-800 font-medium">{quiz.title}</p>
                        {quiz.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1935ca]">
                        {quiz.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        quiz.difficultyLevel === 'Easy' ? 'bg-green-50 text-green-700' :
                        quiz.difficultyLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {quiz.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="size-4" />
                        <span className="text-sm">{quiz.timeLimit} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HelpCircle className="size-4" />
                        <span className="text-sm">{quiz.passingScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit className="size-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          disabled={deletingId === quiz.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Quiz"
                        >
                          {deletingId === quiz.id ? (
                            <Loader2 className="size-5 animate-spin" />
                          ) : (
                            <Trash2 className="size-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="size-16 mx-auto" />
          </div>
          <h3 className="text-gray-600 mb-2">No quizzes found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || selectedCategory !== "All Categories" 
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first quiz"
            }
          </p>
          {!searchQuery && selectedCategory === "All Categories" && (
            <Link
              to="/admin/quiz/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
            >
              <Plus className="size-5" />
              Create Your First Quiz
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

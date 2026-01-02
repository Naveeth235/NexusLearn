import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { questionService } from "../../lib/api";

interface Question {
  id: number;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  rightAnswer: string;
  difficultyLevel: string;
  category: string;
}

const categories = ["All Categories", "Java", "Python", "JavaScript", "Programming"];

export function QuestionsListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const questionsPerPage = 10;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = async (id: number) => {
    try {
      await questionService.deleteQuestion(id);
      setQuestionToDelete(null);
      // Refresh the questions list
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1935ca] mb-2">Question Management</h1>
          <p className="text-gray-600">Manage quiz questions and answers</p>
        </div>
        <Link
          to="/admin/questions/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#1935CA] to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all hover:scale-105"
        >
          <Plus className="size-5" />
          Add Question
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
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
        </div>
      </div>

      {/* Questions Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Question</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Difficulty</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Last Updated</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-gray-800">{truncateText(question.questionTitle)}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    4 options
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                    {question.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    question.difficultyLevel === "Easy" ? "bg-green-100 text-green-700" :
                    question.difficultyLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {question.difficultyLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    N/A
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/questions/${question.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </Link>
                    <button
                      onClick={() => setQuestionToDelete(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Questions Cards - Mobile */}
      <div className="md:hidden space-y-4 mb-8">
        {currentQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                  {question.category}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  question.difficultyLevel === "Easy" ? "bg-green-100 text-green-700" :
                  question.difficultyLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {question.difficultyLevel}
                </span>
              </div>
            </div>
            <p className="text-gray-800 mb-2">{truncateText(question.questionTitle)}</p>
            <p className="text-sm text-gray-500 mb-4">
              4 options
            </p>
            <div className="flex gap-2">
              <Link
                to={`/admin/questions/${question.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="size-4" />
                Edit
              </Link>
              <button
                onClick={() => setQuestionToDelete(question.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Search className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No questions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-[#1935CA] text-white"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-gray-800 mb-4">Delete Question?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setQuestionToDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(questionToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, HelpCircle, Trophy, Target, Loader2, Plus } from "lucide-react";
import { useQuizzes } from "../../hooks/useQuizzes";
import { useAuth } from "../../context/AuthContext";

const categories = ["All Categories", "Data Structure", "Cyber Security", "Cloud Computing", "Network Security"];

export function QuizListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { quizzes, loading, error } = useQuizzes();
  const { user } = useAuth();

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
          <p>Failed to load quizzes. Please try again later.</p>
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
          <h1 className="text-[#1935ca] mb-2">Quiz Library</h1>
          <p className="text-gray-600">Test your knowledge and track your progress</p>
        </div>
        
        {/* Admin: Create Quiz Button */}
        {user?.roles?.includes('ADMIN') && (
          <Link
            to="/admin/quiz/create"
            className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            <Plus className="size-5" />
            Create Quiz
          </Link>
        )}
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

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          return (
            <div 
              key={quiz.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                    {quiz.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Quiz Title */}
              <h3 className="text-gray-800 mb-2">{quiz.title}</h3>

              {/* Description */}
              {quiz.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {quiz.description}
                </p>
              )}

              {/* Action Button */}
              <Link 
                to={`/quiz/${quiz.id}/take`}
                className="block w-full bg-[#1935CA] text-white py-2 rounded-lg hover:bg-[#152a9e] transition-colors text-center mt-4"
              >
                Take Quiz
              </Link>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="size-16 mx-auto" />
          </div>
          <h3 className="text-gray-600 mb-2">No quizzes found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

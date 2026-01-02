import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Save, Loader2 } from "lucide-react";
import { quizService, questionService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  questionId?: number; // For compatibility
  questionTitle: string;
  category: string;
  difficulty: string;
  difficultyLevel?: string; // Backend might use this
}

export function AdminQuizCreationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams(); // Get quiz ID from URL for edit mode
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Available questions
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quiz form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "Medium",
    timeLimit: 30,
    passingScore: 70,
    questionIds: [] as number[]
  });

  // Load existing quiz if in edit mode
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isEditMode || !id) return;
      
      try {
        setLoading(true);
        const quiz = await quizService.getQuizById(id);
        setFormData({
          title: quiz.title || "",
          description: quiz.description || "",
          category: quiz.category || "",
          difficultyLevel: quiz.difficultyLevel || "Medium",
          timeLimit: quiz.timeLimit || 30,
          passingScore: quiz.passingScore || 70,
          questionIds: quiz.questionIds || []
        });
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, isEditMode]);

  // Load all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const questions = await questionService.getAllQuestions() as Question[];
        console.log("Fetched questions:", questions);
        // Normalize the questions to ensure both id and questionId are set
        const normalizedQuestions = questions
          .filter(q => q.id || q.questionId) // Filter out questions without valid IDs
          .map(q => ({
            ...q,
            id: (q.id || q.questionId)!,
            questionId: q.questionId || q.id || 0,
            difficulty: q.difficulty || q.difficultyLevel || 'Medium'
          }));
        console.log("Normalized questions:", normalizedQuestions);
        setAllQuestions(normalizedQuestions);
        setFilteredQuestions(normalizedQuestions);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Failed to load questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuestions(allQuestions);
    } else {
      const filtered = allQuestions.filter(q =>
        q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  }, [searchQuery, allQuestions]);

  // Check if user is admin
  if (!user || !user.roles?.includes('ADMIN')) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">Access Denied</h2>
          <p className="text-gray-500 mb-6">You must be an admin to create quizzes</p>
          <Link to="/admin/quizzes" className="text-[#1935ca] hover:underline">
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' || name === 'passingScore' ? parseInt(value) || 0 : value
    }));
  };

  const toggleQuestion = (id: number) => {
    console.log('Toggling question:', id, 'Current IDs:', formData.questionIds);
    setFormData(prev => ({
      ...prev,
      questionIds: prev.questionIds.includes(id)
        ? prev.questionIds.filter(qid => qid !== id)
        : [...prev.questionIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError("Quiz title is required");
      return;
    }
    if (!formData.category.trim()) {
      setError("Quiz category is required");
      return;
    }
    if (formData.questionIds.length === 0) {
      setError("Please select at least one question");
      return;
    }
    if (formData.timeLimit < 1) {
      setError("Time limit must be at least 1 minute");
      return;
    }
    if (formData.passingScore < 0 || formData.passingScore > 100) {
      setError("Passing score must be between 0 and 100");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      console.log('Submitting quiz with data:', formData);
      
      if (isEditMode && id) {
        await quizService.updateQuiz(id, formData);
        setSuccess("Quiz updated successfully!");
      } else {
        await quizService.createQuiz(formData);
        setSuccess("Quiz created successfully!");
      }
      
      setTimeout(() => {
        navigate("/admin/quizzes");
      }, 1500);
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} quiz:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} quiz`);
      setSaving(false);
    }
  };

  const selectedQuestions = allQuestions.filter(q => formData.questionIds.includes(q.id));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/admin/quizzes" 
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Quizzes
        </Link>
        <h1 className="text-[#1935ca] mb-2">
          {isEditMode ? "Edit Quiz" : "Create New Quiz"}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? "Update quiz details and questions" : "Add a new quiz for students to take"}
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quiz Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-gray-800 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Quiz Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Java Fundamentals Quiz"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of what this quiz covers..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Programming"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficultyLevel"
                      value={formData.difficultyLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                    >
                      <option key="easy" value="Easy">Easy</option>
                      <option key="medium" value="Medium">Medium</option>
                      <option key="hard" value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      name="passingScore"
                      value={formData.passingScore}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Question Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-gray-800 mb-4">
                Select Questions ({formData.questionIds.length} selected)
              </h2>

              {/* Search Questions */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] mb-4"
              />

              {/* Questions List */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="size-8 animate-spin text-[#1935ca] mx-auto" />
                  <p className="mt-2 text-gray-600">Loading questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No questions found matching your search' : 'No questions available'}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      onClick={() => toggleQuestion(question.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.questionIds.includes(question.id)
                          ? 'border-[#1935CA] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 size-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          formData.questionIds.includes(question.id)
                            ? 'border-[#1935CA] bg-[#1935CA]'
                            : 'border-gray-300'
                        }`}>
                          {formData.questionIds.includes(question.id) && (
                            <svg key="checkmark" className="size-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 mb-1">{question.questionTitle}</p>
                          <div className="flex gap-2">
                            <span className="text-xs text-[#1935ca] bg-blue-100 px-2 py-1 rounded">
                              {question.category}
                            </span>
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Quiz Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-gray-800 mb-4">Quiz Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="text-gray-800">{formData.questionIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="text-gray-800">{formData.timeLimit} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="text-gray-800">{formData.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="text-gray-800">{formData.difficultyLevel}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Selected Questions Preview */}
              {selectedQuestions.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-700 mb-2">Selected Questions:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedQuestions.map((q, index) => (
                      <div key={q.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                        <span className="text-gray-500">{index + 1}.</span>
                        <span className="text-gray-700 flex-1">{q.questionTitle.substring(0, 50)}...</span>
                        <button
                          type="button"
                          onClick={() => toggleQuestion(q.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 my-4"></div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={saving || formData.questionIds.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    Create Quiz
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/quizzes")}
                disabled={saving}
                className="w-full mt-3 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

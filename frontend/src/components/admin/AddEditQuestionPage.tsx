import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { questionService } from "../../lib/api";

const categories = ["Java", "Python", "JavaScript", "Programming"];

export function AddEditQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    questionTitle: "",
    category: "Java",
    difficultyLevel: "Easy" as "Easy" | "Medium" | "Hard",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightAnswer: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadQuestion();
    }
  }, [id, isEditMode]);

  const loadQuestion = async () => {
    try {
      setLoadingQuestion(true);
      const question = await questionService.getQuestionById(parseInt(id!));
      setFormData({
        questionTitle: question.questionTitle,
        category: question.category,
        difficultyLevel: question.difficultyLevel,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        rightAnswer: question.rightAnswer
      });
    } catch (error) {
      console.error("Error loading question:", error);
      setErrors({ submit: "Failed to load question" });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionTitle.trim()) {
      newErrors.questionTitle = "Question text is required";
    }

    if (!formData.option1.trim()) {
      newErrors.option1 = "Option 1 is required";
    }

    if (!formData.option2.trim()) {
      newErrors.option2 = "Option 2 is required";
    }

    if (!formData.option3.trim()) {
      newErrors.option3 = "Option 3 is required";
    }

    if (!formData.option4.trim()) {
      newErrors.option4 = "Option 4 is required";
    }

    if (!formData.rightAnswer.trim()) {
      newErrors.rightAnswer = "Please select the correct answer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const questionData = {
        questionTitle: formData.questionTitle,
        category: formData.category,
        difficultyLevel: formData.difficultyLevel,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        rightAnswer: formData.rightAnswer
      };

      if (isEditMode && id) {
        await questionService.updateQuestion(parseInt(id), questionData);
      } else {
        await questionService.createQuestion(questionData);
      }

      navigate("/admin/questions");
    } catch (error: any) {
      console.error("Error saving question:", error);
      setErrors({ submit: error.message || "Failed to save question" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/questions");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/admin/questions" 
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Questions
        </Link>
        <h1 className="text-[#1935ca] mb-2">
          {isEditMode ? "Edit Question" : "Add New Question"}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? "Update the question details below" : "Fill in the details to create a new question"}
        </p>
      </div>

      {/* Form */}
      {loadingQuestion ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Question Text */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-gray-800 mb-2">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.questionTitle}
              onChange={(e) => setFormData({ ...formData, questionTitle: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                errors.questionTitle ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter the question text here..."
            />
            {errors.questionTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.questionTitle}</p>
            )}
          </div>

        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-gray-800 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {categories.filter(c => c !== "All Categories").map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-gray-800 mb-2">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.difficultyLevel}
              onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as "Easy" | "Medium" | "Hard" })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-800 mb-4">Answer Options</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the correct answer by clicking the radio button next to it
          </p>

          <div className="space-y-4">
            {/* Option 1 */}
            <div>
              <div className="flex items-start gap-3">
                <div className="flex items-center h-11">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.rightAnswer === formData.option1}
                    onChange={() => setFormData({ ...formData, rightAnswer: formData.option1 })}
                    className="size-4 text-[#1935CA] focus:ring-[#1935CA]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Option 1 <span className="text-red-500">*</span>
                    {formData.rightAnswer === formData.option1 && formData.option1 && (
                      <span className="ml-2 text-green-600">(Correct Answer)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.option1}
                    onChange={(e) => {
                      const newOption = e.target.value;
                      const wasCorrect = formData.rightAnswer === formData.option1;
                      setFormData({ 
                        ...formData, 
                        option1: newOption,
                        rightAnswer: wasCorrect ? newOption : formData.rightAnswer
                      });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                      errors.option1 ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter option 1"
                  />
                  {errors.option1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.option1}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Option 2 */}
            <div>
              <div className="flex items-start gap-3">
                <div className="flex items-center h-11">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.rightAnswer === formData.option2}
                    onChange={() => setFormData({ ...formData, rightAnswer: formData.option2 })}
                    className="size-4 text-[#1935CA] focus:ring-[#1935CA]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Option 2 <span className="text-red-500">*</span>
                    {formData.rightAnswer === formData.option2 && formData.option2 && (
                      <span className="ml-2 text-green-600">(Correct Answer)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.option2}
                    onChange={(e) => {
                      const newOption = e.target.value;
                      const wasCorrect = formData.rightAnswer === formData.option2;
                      setFormData({ 
                        ...formData, 
                        option2: newOption,
                        rightAnswer: wasCorrect ? newOption : formData.rightAnswer
                      });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                      errors.option2 ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter option 2"
                  />
                  {errors.option2 && (
                    <p className="mt-1 text-sm text-red-600">{errors.option2}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Option 3 */}
            <div>
              <div className="flex items-start gap-3">
                <div className="flex items-center h-11">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.rightAnswer === formData.option3}
                    onChange={() => setFormData({ ...formData, rightAnswer: formData.option3 })}
                    className="size-4 text-[#1935CA] focus:ring-[#1935CA]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Option 3 <span className="text-red-500">*</span>
                    {formData.rightAnswer === formData.option3 && formData.option3 && (
                      <span className="ml-2 text-green-600">(Correct Answer)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.option3}
                    onChange={(e) => {
                      const newOption = e.target.value;
                      const wasCorrect = formData.rightAnswer === formData.option3;
                      setFormData({ 
                        ...formData, 
                        option3: newOption,
                        rightAnswer: wasCorrect ? newOption : formData.rightAnswer
                      });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                      errors.option3 ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter option 3"
                  />
                  {errors.option3 && (
                    <p className="mt-1 text-sm text-red-600">{errors.option3}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Option 4 */}
            <div>
              <div className="flex items-start gap-3">
                <div className="flex items-center h-11">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.rightAnswer === formData.option4}
                    onChange={() => setFormData({ ...formData, rightAnswer: formData.option4 })}
                    className="size-4 text-[#1935CA] focus:ring-[#1935CA]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Option 4 <span className="text-red-500">*</span>
                    {formData.rightAnswer === formData.option4 && formData.option4 && (
                      <span className="ml-2 text-green-600">(Correct Answer)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.option4}
                    onChange={(e) => {
                      const newOption = e.target.value;
                      const wasCorrect = formData.rightAnswer === formData.option4;
                      setFormData({ 
                        ...formData, 
                        option4: newOption,
                        rightAnswer: wasCorrect ? newOption : formData.rightAnswer
                      });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                      errors.option4 ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter option 4"
                  />
                  {errors.option4 && (
                    <p className="mt-1 text-sm text-red-600">{errors.option4}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="size-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                {isEditMode ? "Update Question" : "Save Question"}
              </>
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
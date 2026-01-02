import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { courseService } from "../../lib/api";

const categories = ["Web Development", "Data Science", "Mobile Development", "Programming", "Design", "Business"];
const levels = ["Beginner", "Intermediate", "Advanced"];

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: string;
  imageUrl?: string;
  rating?: number;
  prerequisites?: string;
  enrolledStudents?: number;
}

export function AddEditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    instructor: "",
    duration: "",
    level: "Beginner",
    imageUrl: "",
    prerequisites: "",
    rating: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadCourse();
    }
  }, [id, isEditMode]);

  const loadCourse = async () => {
    try {
      setLoadingCourse(true);
      const course = await courseService.getCourseById(id!) as Course;
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "Web Development",
        instructor: course.instructor || "",
        duration: course.duration || "",
        level: course.level || "Beginner",
        imageUrl: course.imageUrl || "",
        prerequisites: course.prerequisites || "",
        rating: course.rating || 0
      });
    } catch (error) {
      console.error("Error loading course:", error);
      setErrors({ submit: "Failed to load course" });
    } finally {
      setLoadingCourse(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
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

      const courseData = {
        ...formData,
        rating: formData.rating || 0
      };

      if (isEditMode) {
        await courseService.updateCourse(id!, courseData);
      } else {
        await courseService.createCourse(courseData);
      }

      navigate("/admin/courses");
    } catch (error: any) {
      console.error("Error saving course:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to save course. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1935ca] mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl text-gray-800">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode
              ? "Update course information and settings"
              : "Add a new course to the platform"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <X className="size-5 flex-shrink-0 mt-0.5" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm text-gray-700 mb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                placeholder="e.g., Complete Web Development Bootcamp"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none resize-none ${
                  errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Describe what students will learn in this course..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm text-gray-700 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instructor and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instructor" className="block text-sm text-gray-700 mb-2">
                  Instructor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none ${
                    errors.instructor ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="e.g., John Doe"
                />
                {errors.instructor && (
                  <p className="mt-1 text-sm text-red-600">{errors.instructor}</p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none ${
                    errors.duration ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="e.g., 27 hours"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none"
                placeholder="https://example.com/course-image.jpg"
              />
            </div>

            {/* Prerequisites */}
            <div>
              <label htmlFor="prerequisites" className="block text-sm text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none resize-none"
                placeholder="List any prerequisites for this course (optional)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate multiple prerequisites with commas
              </p>
            </div>

            {/* Rating (optional) */}
            <div>
              <label htmlFor="rating" className="block text-sm text-gray-700 mb-2">
                Initial Rating
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1935ca] focus:border-transparent outline-none"
                placeholder="0.0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Rating from 0 to 5 (leave as 0 for new courses)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-initial px-8 py-3 bg-[#1935ca] text-white rounded-lg hover:bg-[#152a9f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>{isEditMode ? "Update Course" : "Create Course"}</span>
                </>
              )}
            </button>
            <Link
              to="/admin/courses"
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Users, Calendar, CheckCircle, Clock } from "lucide-react";
import { courseService } from "../../lib/api";

const categories = ["All Categories", "Web Development", "Data Science", "Mobile Development", "Programming"];

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

export function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses() as Course[];
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await courseService.deleteCourse(id.toString());
      setCourseToDelete(null);
      // Refresh the courses list
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1935ca] mb-2">Course Management</h1>
          <p className="text-gray-600">Manage platform courses and content</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-2 bg-[#1935CA] text-white px-6 py-3 rounded-lg hover:bg-[#152a9e] transition-colors"
        >
          <Plus className="size-5" />
          Add Course
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
              placeholder="Search courses by name or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent appearance-none bg-white cursor-pointer"
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
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </div>
      </div>

      {/* Courses Table - Desktop */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1935CA]"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : (
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Course Name</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Instructor</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Enrolled Users</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Created</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-gray-800">{course.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{course.instructor}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="size-4" />
                    <span>0</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Published
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="size-4" />
                    <span className="text-sm">N/A</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="p-2 text-[#1935ca] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit course"
                    >
                      <Edit className="size-4" />
                    </Link>
                    <button
                      onClick={() => setCourseToDelete(course.id)}
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
      )}

      {/* Courses Cards - Mobile */}
      {!loading && (
        <div className="md:hidden space-y-4 mb-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-2">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Published
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="text-gray-800">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-800">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="text-gray-800">{course.level}</span>
                </div>
              </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/courses/edit/${course.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="size-4" />
                Edit
              </Link>
              <button 
                onClick={() => setCourseToDelete(course.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Search className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-gray-800 mb-4">Delete Course?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone and will affect all enrolled users.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCourseToDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(courseToDelete)}
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

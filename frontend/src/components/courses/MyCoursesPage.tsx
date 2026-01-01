import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Trophy,
  TrendingUp,
  Target,
  Loader2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { useEnrolledCourses, Enrollment } from "../../hooks/useCourses";

export function MyCoursesPage() {
  const { enrolledCourses, loading, error, fetchEnrolledCourses, unenroll } = useEnrolledCourses();
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [unenrolling, setUnenrolling] = useState<number | null>(null);

  // Filter courses based on status
  const filteredCourses = enrolledCourses.filter(enrollment => {
    if (enrollment.status !== 'APPROVED') return false;
    if (filter === "in-progress") return enrollment.progress > 0 && enrollment.progress < 100;
    if (filter === "completed") return enrollment.progress === 100;
    return true;
  });

  // Calculate stats
  const approvedEnrollments = enrolledCourses.filter(e => e.status === 'APPROVED');
  const totalEnrolled = approvedEnrollments.length;
  const inProgress = approvedEnrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const completed = approvedEnrollments.filter(e => e.progress === 100).length;
  const avgProgress = totalEnrolled > 0 
    ? Math.round(approvedEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalEnrolled)
    : 0;

  const getPlaceholderImage = (courseId: number) => {
    const images = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
    ];
    return images[courseId % images.length];
  };

  const handleUnenroll = async (enrollmentId: number) => {
    if (!window.confirm('Are you sure you want to unenroll from this course? Your progress will be lost.')) {
      return;
    }
    
    try {
      setUnenrolling(enrollmentId);
      await unenroll(enrollmentId);
    } catch (err) {
      console.error('Failed to unenroll:', err);
    } finally {
      setUnenrolling(null);
    }
  };

  const getTotalLessons = (enrollment: Enrollment) => {
    if (!enrollment.course.chapters) return 0;
    return enrollment.course.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
          <span className="ml-2 text-gray-600">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="size-6 text-red-500" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading courses</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={fetchEnrolledCourses}
            className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">My Courses</h1>
        <p className="text-gray-600">Track your learning progress and continue your journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="size-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Enrolled</p>
          <p className="text-2xl font-bold text-[#1935ca]">{totalEnrolled}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="size-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-[#1935ca]">{inProgress}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="size-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-[#1935ca]">{completed}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="size-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
          <p className="text-2xl font-bold text-[#1935ca]">{avgProgress}%</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`pb-3 px-4 transition-colors relative ${
              filter === "all" 
                ? "text-[#1935ca]" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Courses ({totalEnrolled})
            {filter === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1935CA]" />
            )}
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`pb-3 px-4 transition-colors relative ${
              filter === "in-progress" 
                ? "text-[#1935ca]" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            In Progress ({inProgress})
            {filter === "in-progress" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1935CA]" />
            )}
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`pb-3 px-4 transition-colors relative ${
              filter === "completed" 
                ? "text-[#1935ca]" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed ({completed})
            {filter === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1935CA]" />
            )}
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((enrollment) => (
            <div 
              key={enrollment.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Course Image */}
                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                  <img 
                    src={enrollment.course.imageUrl || getPlaceholderImage(enrollment.course.id)} 
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(enrollment.course.id);
                    }}
                  />
                  {enrollment.progress === 100 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle className="size-4" />
                      Completed
                    </div>
                  )}
                </div>

                {/* Course Details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
                          {enrollment.course.category}
                        </span>
                        <span className="text-sm text-gray-500">{enrollment.course.level}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{enrollment.course.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {enrollment.course.description}
                      </p>
                      <p className="text-sm text-gray-500">Instructor: {enrollment.course.instructor}</p>
                    </div>
                    
                    {/* Unenroll button */}
                    <button
                      onClick={() => handleUnenroll(enrollment.id)}
                      disabled={unenrolling === enrollment.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Unenroll from course"
                    >
                      {unenrolling === enrollment.id ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Trash2 className="size-5" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          enrollment.progress === 100 ? 'bg-green-500' : 'bg-[#1935CA]'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Meta and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{enrollment.course.duration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-4" />
                        <span>{getTotalLessons(enrollment)} lessons</span>
                      </div>
                      {enrollment.completedLessons > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="size-4 text-green-500" />
                          <span>{enrollment.completedLessons} completed</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link 
                        to={`/courses/${enrollment.course.id}`}
                        className="text-[#1935ca] hover:underline text-sm"
                      >
                        View Details
                      </Link>
                      {enrollment.progress === 100 ? (
                        <Link 
                          to={`/courses/${enrollment.course.id}/learn`}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="size-4" />
                          Review Course
                        </Link>
                      ) : (
                        <Link 
                          to={`/courses/${enrollment.course.id}/learn`}
                          className="bg-[#1935CA] text-white px-4 py-2 rounded-lg hover:bg-[#152a9e] transition-colors flex items-center gap-2 text-sm"
                        >
                          <PlayCircle className="size-4" />
                          {enrollment.progress === 0 ? "Start Course" : "Continue"}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Enrolled date */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {enrollment.lastAccessedAt && (
                        <> • Last accessed {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {filter === "completed" 
                ? "You haven't completed any courses yet" 
                : filter === "in-progress"
                ? "You don't have any courses in progress"
                : "You haven't enrolled in any courses yet"}
            </p>
            <Link 
              to="/courses"
              className="inline-block bg-[#1935CA] text-white px-6 py-2 rounded-lg hover:bg-[#152a9e] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

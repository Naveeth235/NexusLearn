import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { useEnrolledCourses, Enrollment } from "../hooks/useCourses";

export function ContinueLearning() {
  const { enrolledCourses, loading, error } = useEnrolledCourses();

  // Placeholder image
  const getPlaceholderImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    ];
    return images[index % images.length];
  };

  // Get only approved and in-progress courses (not completed)
  const inProgressCourses = enrolledCourses
    .filter(e => e.status === 'APPROVED' && e.progress < 100)
    .slice(0, 2);

  const getTotalLessons = (enrollment: Enrollment) => {
    if (!enrollment.course.chapters) return 0;
    return enrollment.course.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-[#1935ca] mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
              <div className="flex gap-4">
                <div className="size-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-[#1935ca] mb-6">Continue Learning</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-[#1935ca] mb-6">Continue Learning</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="inline-block mt-4 text-[#1935ca] hover:underline">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  if (inProgressCourses.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-[#1935ca] mb-6">Continue Learning</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">All your courses are completed! 🎉</p>
          <Link to="/courses" className="inline-block mt-4 text-[#1935ca] hover:underline">
            Explore More Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#1935ca]">Continue Learning</h2>
        <Link to="/my-courses" className="text-sm text-[#1935ca] hover:underline flex items-center gap-1 group">
          View all 
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inProgressCourses.map((enrollment, index) => {
          const totalLessons = getTotalLessons(enrollment);
          const totalChapters = enrollment.course.chapters?.length || 0;
          
          return (
            <div key={enrollment.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-[1.01]">
              <div className="flex gap-4">
                <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                  <img 
                    src={enrollment.course?.imageUrl || getPlaceholderImage(index)} 
                    alt={enrollment.course?.title || 'Course'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(index);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-800 mb-1 truncate group-hover:text-[#1935ca] transition-colors">
                    {enrollment.course?.title || 'Course Title'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{enrollment.course?.instructor || 'Instructor'}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{enrollment.progress || 0}% Complete</span>
                      <span className="text-[#1935ca] font-medium">
                        {enrollment.completedLessons || 0}/{totalLessons} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#1935CA] to-blue-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                to={`/courses/${enrollment.course.id}`}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1935CA] to-blue-600 text-white py-2.5 rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all group-hover:scale-[1.02]"
              >
                <Play className="size-4" />
                {enrollment.progress === 0 ? 'Start Learning' : 'Continue Learning'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
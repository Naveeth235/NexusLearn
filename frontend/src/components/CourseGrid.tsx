import { ArrowRight, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";

interface CourseGridProps {
  limit?: number;
}

export function CourseGrid({ limit }: CourseGridProps = {}) {
  const { courses, loading, error } = useCourses();

  // Limit courses if specified
  const displayCourses = limit ? courses.slice(0, limit) : courses;

  // Placeholder image
  const getPlaceholderImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    ];
    return images[index % images.length];
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-[#1935ca] mb-6">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
        <h2 className="text-[#1935ca] mb-6">Available Courses</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#1935ca]">Available Courses</h2>
        <Link to="/courses" className="text-sm text-[#1935ca] hover:underline flex items-center gap-1 group">
          View all
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course, index) => (
            <Link 
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                <img 
                  src={course.imageUrl || getPlaceholderImage(index)}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(index);
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-[#1935ca] shadow-lg">
                  {course.category || 'General'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <h3 className="text-gray-800 mb-2 group-hover:text-[#1935ca] transition-colors line-clamp-2 min-h-[3rem]">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-700">{course.rating || 0}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="size-4" />
                      <span className="text-sm">{course.enrolledStudents || 0}+</span>
                    </div>
                  </div>
                  <ArrowRight className="size-5 text-[#1935ca] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
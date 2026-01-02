import { Clock, Users, Star, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Course {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  duration?: string;
  lessons?: number;
  enrolledStudents?: number;
  badge?: string;
  instructor?: string;
  level?: string;
  rating?: number;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const getPlaceholderImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    ];
    return images[Number(course.id) % images.length];
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
        {/* Course Image */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={course.imageUrl || getPlaceholderImage(Number(course.id))} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(Number(course.id));
            }}
          />
          {course.badge && (
            <span className="absolute top-3 left-3 bg-[#1935CA] text-white px-3 py-1 rounded-full text-sm">
              {course.badge}
            </span>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="size-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{course.rating || 0}</span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#1935ca] bg-blue-50 px-3 py-1 rounded-full">
              {course.category || 'General'}
            </span>
            {course.level && <span className="text-xs text-gray-500">{course.level}</span>}
          </div>

          {/* Course Title */}
          <h3 className="text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
            {course.title}
          </h3>

          {/* Course Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {truncateDescription(course.description || 'No description available')}
          </p>

          {/* Course Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{course.duration || 'TBD'}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="size-4" />
              <span>{course.lessons || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{course.enrolledStudents || 0}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="text-sm text-gray-500 mb-4">
            By {course.instructor || 'NexusLearn'}
          </div>

          {/* Enroll Button */}
          {false ? (
            <button className="w-full bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors">
              Continue Learning
            </button>
          ) : (
            <button className="w-full bg-[#1935CA] text-white py-2 rounded-lg hover:bg-[#152a9e] transition-colors">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

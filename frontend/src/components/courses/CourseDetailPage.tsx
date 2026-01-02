import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  CheckCircle,
  Lock,
  Award,
  Loader2
} from "lucide-react";
import { courseService, enrollmentService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  type: 'VIDEO' | 'READING' | 'QUIZ';
}

interface Chapter {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  rating: number;
  duration: string;
  imageUrl: string;
  level: string;
  enrolledStudents: number;
  prerequisites?: string;
  chapters: Chapter[];
}

export function CourseDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const getPlaceholderImage = (courseId: string) => {
    const images = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
    ];
    return images[parseInt(courseId) % images.length];
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id!);
        setCourse(data as Course);
        
        // Check if user is already enrolled
        if (isAuthenticated && user?.id) {
          try {
            const enrollments = await enrollmentService.getStudentEnrollments(user.id.toString()) as Array<{ course: { id: number }, status: 'PENDING' | 'APPROVED' | 'REJECTED' }>;
            const enrollment = enrollments.find((e) => e.course.id.toString() === id);
            if (enrollment) {
              setEnrolled(true);
              setEnrollmentStatus(enrollment.status);
            }
          } catch (err) {
            console.error('Failed to check enrollment:', err);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200" />
              <div className="p-8 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Courses
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">Course not found</h2>
          <Link to="/courses" className="text-[#1935ca] hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const prerequisites = course.prerequisites ? course.prerequisites.split(',') : [];
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  const handleEnrollment = async () => {
    if (!isAuthenticated || !user || !user.id) {
      setEnrollmentError('Please login to enroll in this course');
      return;
    }

    try {
      setEnrolling(true);
      setEnrollmentError(null);
      await enrollmentService.enrollStudent(user.id.toString(), id!);
      setEnrolled(true);
      setEnrollmentStatus('PENDING');
    } catch (err: any) {
      setEnrollmentError(err.message || 'Failed to enroll in course');
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/courses" 
        className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-6"
      >
        <ArrowLeft className="size-4" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Image */}
          <div className="relative h-80 lg:h-auto">
            <img 
              src={course.imageUrl || getPlaceholderImage(id!)}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getPlaceholderImage(id!);
              }}
            />
            <span className="absolute top-4 left-4 bg-[#1935CA] text-white px-4 py-2 rounded-full">
              {course.level}
            </span>
          </div>

          {/* Course Info */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-[#1935ca] bg-blue-50 px-4 py-1 rounded-full">
                {course.category}
              </span>
              <span className="text-sm text-gray-600 bg-gray-100 px-4 py-1 rounded-full">
                {course.level}
              </span>
            </div>

            <h1 className="text-[#1935ca] mb-4">{course.title}</h1>

            <p className="text-gray-700 mb-6">{course.description}</p>

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="size-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="size-5" />
                <span>{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="size-5" />
                <span>{course.enrolledStudents} Students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="size-5 text-yellow-500 fill-yellow-500" />
                <span>{course.rating} Rating</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Instructor</p>
              <p className="text-gray-800">{course.instructor}</p>
            </div>

            {/* Action Button */}
            {enrollmentError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {enrollmentError}
              </div>
            )}
            
            {enrolled ? (
              <div>
                {enrollmentStatus === 'PENDING' && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-center gap-2">
                    <Clock className="size-4" />
                    Enrollment pending admin approval
                  </div>
                )}
                {enrollmentStatus === 'APPROVED' && (
                  <>
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="size-4" />
                      You are enrolled in this course
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Your Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1935CA] h-2 rounded-full transition-all"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                    <Link 
                      to={`/courses/${id}/learn`}
                      className="w-full bg-[#1935CA] text-white py-3 rounded-lg hover:bg-[#152a9e] transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="size-5" />
                      Continue Course
                    </Link>
                  </>
                )}
                {enrollmentStatus === 'REJECTED' && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                    <Lock className="size-4" />
                    Enrollment request was rejected
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleEnrollment}
                disabled={enrolling || !isAuthenticated}
                className="w-full bg-[#1935CA] text-white py-3 rounded-lg hover:bg-[#152a9e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Enrolling...
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <Lock className="size-5" />
                    Login to Enroll
                  </>
                ) : (
                  <>
                    <Award className="size-5" />
                    Enroll in Course
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-[#1935ca] mb-4">Prerequisites</h2>
              <ul className="space-y-2">
                {prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{prereq.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Content/Modules */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#1935ca] mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.chapters.map((chapter, chapterIndex) => (
                <div 
                  key={chapter.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
                        <span>{chapterIndex + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-gray-800">{chapter.title}</h3>
                        <p className="text-sm text-gray-500">
                          {chapter.lessons.length} lessons • {chapter.duration}
                        </p>
                      </div>
                    </div>
                    {!enrolled && (
                      <Lock className="size-5 text-gray-400" />
                    )}
                  </div>

                  {/* Lessons List */}
                  <div className="divide-y divide-gray-100">
                    {chapter.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === "VIDEO" && (
                            <PlayCircle className="size-5 text-gray-400" />
                          )}
                          {lesson.type === "READING" && (
                            <FileText className="size-5 text-gray-400" />
                          )}
                          {lesson.type === "QUIZ" && (
                            <Award className="size-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm text-gray-700">
                              {lesson.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* What You'll Learn */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-[#1935ca] mb-4">What You'll Learn</h3>
            <ul className="space-y-3">
              {course.chapters.slice(0, 4).map((chapter) => (
                <li key={chapter.id} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{chapter.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-[#1935ca] mb-4">Course Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-800">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level</span>
                <span className="text-gray-800">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chapters</span>
                <span className="text-gray-800">{course.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lessons</span>
                <span className="text-gray-800">{totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students</span>
                <span className="text-gray-800">{course.enrolledStudents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

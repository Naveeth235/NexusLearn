import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  Menu,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { courseService, enrollmentService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  type: "VIDEO" | "READING" | "QUIZ";
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
  chapters: Chapter[];
}

interface Enrollment {
  id: number;
  progress: number;
  completedLessons: number;
}

export function CourseLearningPage() {
  const { id: courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const [markingComplete, setMarkingComplete] = useState(false);

  // Get current chapter and lesson from URL params
  const currentChapterIndex = parseInt(searchParams.get("chapter") || "0");
  const currentLessonIndex = parseInt(searchParams.get("lesson") || "0");

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (!courseId || !user?.id) return;

      try {
        setLoading(true);
        
        // Fetch course details
        const courseData = await courseService.getCourseById(courseId) as Course;
        setCourse(courseData);

        // Fetch enrollment to get progress
        const enrollments = await enrollmentService.getStudentEnrollments(user.id.toString()) as Array<Enrollment & { course: { id: number } }>;
        const userEnrollment = enrollments.find((e) => e.course.id.toString() === courseId);
        
        if (!userEnrollment) {
          setError("You are not enrolled in this course");
          return;
        }
        
        setEnrollment(userEnrollment);

        // Initialize completed lessons from storage (in real app, this would come from backend)
        const storedCompleted = localStorage.getItem(`course_${courseId}_completed`);
        if (storedCompleted) {
          setCompletedLessonIds(new Set(JSON.parse(storedCompleted)));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId, user]);

  // Get current chapter and lesson
  const currentChapter = course?.chapters[currentChapterIndex];
  const currentLesson = currentChapter?.lessons[currentLessonIndex];

  // Calculate total lessons and current position
  const totalLessons = course?.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0) || 0;
  const currentLessonNumber = course
    ? course.chapters
        .slice(0, currentChapterIndex)
        .reduce((sum, ch) => sum + ch.lessons.length, 0) + currentLessonIndex + 1
    : 0;

  // Navigate to specific lesson
  const navigateToLesson = (chapterIdx: number, lessonIdx: number) => {
    setSearchParams({ chapter: chapterIdx.toString(), lesson: lessonIdx.toString() });
  };

  // Go to previous lesson
  const goToPrevious = () => {
    if (currentLessonIndex > 0) {
      navigateToLesson(currentChapterIndex, currentLessonIndex - 1);
    } else if (currentChapterIndex > 0) {
      const prevChapter = course!.chapters[currentChapterIndex - 1];
      navigateToLesson(currentChapterIndex - 1, prevChapter.lessons.length - 1);
    }
  };

  // Go to next lesson
  const goToNext = () => {
    if (!course) return;
    
    if (currentLessonIndex < currentChapter!.lessons.length - 1) {
      navigateToLesson(currentChapterIndex, currentLessonIndex + 1);
    } else if (currentChapterIndex < course.chapters.length - 1) {
      navigateToLesson(currentChapterIndex + 1, 0);
    }
  };

  // Check if we can go previous/next
  const canGoPrevious = currentChapterIndex > 0 || currentLessonIndex > 0;
  const canGoNext = course && (
    currentChapterIndex < course.chapters.length - 1 || 
    currentLessonIndex < (currentChapter?.lessons.length || 0) - 1
  );

  // Mark lesson as complete
  const markLessonComplete = async () => {
    if (!currentLesson || !enrollment || !user?.id || !courseId) return;

    try {
      setMarkingComplete(true);
      
      const newCompletedIds = new Set(completedLessonIds);
      newCompletedIds.add(currentLesson.id);
      setCompletedLessonIds(newCompletedIds);

      // Save to localStorage (in real app, save to backend)
      localStorage.setItem(`course_${courseId}_completed`, JSON.stringify([...newCompletedIds]));

      // Calculate new progress
      const newProgress = Math.round((newCompletedIds.size / totalLessons) * 100);
      
      // Update enrollment progress
      await enrollmentService.updateProgress(
        enrollment.id.toString(),
        newProgress,
        newCompletedIds.size
      );

      setEnrollment({ ...enrollment, progress: newProgress, completedLessons: newCompletedIds.size });

      // Auto-advance to next lesson
      if (canGoNext) {
        setTimeout(() => goToNext(), 500);
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    } finally {
      setMarkingComplete(false);
    }
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId: number) => completedLessonIds.has(lessonId);

  // Get lesson icon based on type
  const getLessonIcon = (type: Lesson["type"], completed: boolean) => {
    if (completed) {
      return <CheckCircle className="size-5 text-green-500" />;
    }
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="size-5 text-blue-500" />;
      case "READING":
        return <FileText className="size-5 text-orange-500" />;
      case "QUIZ":
        return <Award className="size-5 text-purple-500" />;
      default:
        return <BookOpen className="size-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#1935ca]" />
        <span className="ml-2 text-gray-600">Loading course...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="size-6 text-red-500" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mt-4"
        >
          <ArrowLeft className="size-4" />
          Back to Course
        </Link>
      </div>
    );
  }

  if (!course || !currentChapter || !currentLesson) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-gray-600 mb-4">Course or lesson not found</h2>
        <Link to="/my-courses" className="text-[#1935ca] hover:underline">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const progress = enrollment?.progress || 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1935ca]"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back to Course</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1935CA] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {currentLessonNumber} / {totalLessons} lessons
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chapter/Lesson Navigation */}
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 flex-shrink-0`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{course.title}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded lg:hidden"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Chapters */}
            <div className="space-y-4">
              {course.chapters.map((chapter, chapterIdx) => (
                <div key={chapter.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        chapterIdx === currentChapterIndex
                          ? "bg-[#1935CA] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {chapterIdx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {chapter.title}
                    </span>
                  </div>

                  {/* Lessons */}
                  <div className="ml-4 space-y-1">
                    {chapter.lessons.map((lesson, lessonIdx) => {
                      const isActive =
                        chapterIdx === currentChapterIndex &&
                        lessonIdx === currentLessonIndex;
                      const completed = isLessonCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(chapterIdx, lessonIdx)}
                          className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 text-[#1935ca]"
                              : completed
                              ? "text-green-700 hover:bg-green-50"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {getLessonIcon(lesson.type, completed)}
                          <span className="truncate flex-1">{lesson.title}</span>
                          <span className="text-xs text-gray-400">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Chapter {currentChapterIndex + 1}</span>
                <span>•</span>
                <span>Lesson {currentLessonIndex + 1}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  <span>{currentLesson.duration}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentLesson.title}
              </h1>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Video Player (if video lesson) */}
              {currentLesson.type === "VIDEO" && currentLesson.videoUrl && (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  {currentLesson.videoUrl.includes("youtube") || 
                   currentLesson.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={currentLesson.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}

              {/* Video Placeholder */}
              {currentLesson.type === "VIDEO" && !currentLesson.videoUrl && (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <PlayCircle className="size-16 mx-auto mb-2" />
                    <p>Video content coming soon</p>
                  </div>
                </div>
              )}

              {/* Lesson Content Text */}
              <div className="p-6">
                <div className="prose max-w-none">
                  {currentLesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  ) : (
                    <div className="text-gray-600">
                      <p className="mb-4">
                        Welcome to <strong>{currentLesson.title}</strong>. This lesson covers important concepts
                        that will help you progress in the course.
                      </p>
                      {currentLesson.type === "VIDEO" && (
                        <p className="mb-4">
                          Watch the video above to learn the key concepts. Take notes and feel free to
                          pause and rewind as needed.
                        </p>
                      )}
                      {currentLesson.type === "READING" && (
                        <p className="mb-4">
                          Read through the material carefully. You may want to take notes on the key points
                          and concepts covered in this lesson.
                        </p>
                      )}
                      {currentLesson.type === "QUIZ" && (
                        <p className="mb-4">
                          This lesson includes a quiz to test your understanding. Make sure you've reviewed
                          the previous lessons before attempting the quiz.
                        </p>
                      )}
                      <p>
                        When you're ready, mark this lesson as complete and move on to the next one.
                      </p>
                    </div>
                  )}
                </div>

                {/* External Resources */}
                {currentLesson.videoUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={currentLesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#1935ca] hover:underline"
                    >
                      <ExternalLink className="size-4" />
                      Open in new tab
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mark Complete / Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevious}
                disabled={!canGoPrevious}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-5" />
                Previous
              </button>

              {isLessonCompleted(currentLesson.id) ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="size-5" />
                  Completed
                </div>
              ) : (
                <button
                  onClick={markLessonComplete}
                  disabled={markingComplete}
                  className="bg-[#1935CA] text-white px-6 py-2 rounded-lg hover:bg-[#152a9e] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {markingComplete ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}

              <button
                onClick={goToNext}
                disabled={!canGoNext}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Course Completion */}
            {progress === 100 && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <Award className="size-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Congratulations! 🎉
                </h2>
                <p className="text-green-700 mb-4">
                  You've completed all lessons in this course!
                </p>
                <Link
                  to="/my-courses"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Back to My Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

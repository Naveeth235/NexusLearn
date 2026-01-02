import { useState, useEffect } from "react";
import { CourseGrid } from "./CourseGrid";
import { ContinueLearning } from "./ContinueLearning";
import { BookOpen, Brain, Target, TrendingUp, Trophy, Flame } from "lucide-react";
import { useUser } from "../hooks/useUser";
import { useEnrolledCourses } from "../hooks/useCourses";
import { useQuizzes } from "../hooks/useQuizzes";
import { quizService } from "../lib/api";

export function Dashboard() {
  const { user } = useUser();
  const { enrolledCourses } = useEnrolledCourses();
  const { quizzes } = useQuizzes();
  const [quizStats, setQuizStats] = useState({ taken: 0, avgScore: 0 });
  const [learningStreak, setLearningStreak] = useState(0);
  
  const userName = user?.username || "Student";

  // Fetch quiz history and calculate stats
  useEffect(() => {
    const fetchQuizStats = async () => {
      if (!user?.id) return;
      
      try {
        const userId = user.id || localStorage.getItem('userId');
        if (!userId) return;
        
        const history: any[] = await quizService.getQuizHistory(userId.toString()) as any[];
        
        if (history && history.length > 0) {
          const totalQuizzes = history.length;
          const avgScore = Math.round(
            history.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0) / totalQuizzes
          );
          setQuizStats({ taken: totalQuizzes, avgScore });
        }
      } catch (err) {
        console.error('Failed to fetch quiz stats:', err);
      }
    };

    fetchQuizStats();
  }, [user]);

  // Calculate learning streak based on enrollment activity
  useEffect(() => {
    if (enrolledCourses.length === 0) return;
    
    // Get enrollments with recent activity (lastAccessedAt)
    const activeEnrollments = enrolledCourses
      .filter(e => e.lastAccessedAt)
      .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime());
    
    if (activeEnrollments.length === 0) {
      setLearningStreak(0);
      return;
    }
    
    // Calculate consecutive days of learning
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let checkDate = new Date(today);
    
    // Check for activity on each consecutive day going backwards
    for (let i = 0; i < 365; i++) { // Max 365 days streak
      const hasActivity = activeEnrollments.some(enrollment => {
        const accessDate = new Date(enrollment.lastAccessedAt!);
        accessDate.setHours(0, 0, 0, 0);
        return accessDate.getTime() === checkDate.getTime();
      });
      
      if (hasActivity) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setLearningStreak(streak);
  }, [enrolledCourses]);

  const stats = {
    coursesEnrolled: enrolledCourses.filter(e => e.status === 'APPROVED').length || 0,
    quizzesTaken: quizStats.taken,
    averageScore: quizStats.avgScore
  };

  return (
    <div className="p-8 pb-12 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1935CA] to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-white">Welcome back, {userName}! 👋</h1>
            <p className="text-blue-100">Ready to continue your learning journey?</p>
          </div>
          <div className="hidden md:block">
            <div className="size-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Trophy className="size-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <BookOpen className="size-6 text-white" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <p className="text-gray-600 text-sm mb-1">Courses Enrolled</p>
          <p className="text-3xl text-gray-800">{stats.coursesEnrolled}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
              <Brain className="size-6 text-white" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <p className="text-gray-600 text-sm mb-1">Quizzes Taken</p>
          <p className="text-3xl text-gray-800">{stats.quizzesTaken}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
              <Target className="size-6 text-white" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <p className="text-gray-600 text-sm mb-1">Average Score</p>
          <p className="text-3xl text-gray-800">{stats.averageScore}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] group">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <Flame className="size-6 text-white" />
            </div>
            {learningStreak > 0 && <TrendingUp className="size-5 text-green-500" />}
          </div>
          <p className="text-gray-600 text-sm mb-1">Learning Streak</p>
          <p className="text-3xl text-gray-800">{learningStreak} {learningStreak === 1 ? 'day' : 'days'}</p>
        </div>
      </div>

      {/* Continue Learning */}
      <ContinueLearning />

      {/* Available Courses */}
      <CourseGrid limit={6} />

    </div>
  );
}
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Edit, 
  Mail, 
  Calendar, 
  BookOpen, 
  Brain, 
  Trophy, 
  Target,
  Award,
  Shield,
  Clock,
  Loader2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { enrollmentService, quizService } from "../../lib/api";

export function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    quizzesTaken: 0,
    avgScore: 0,
    hoursLearned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentStats = async () => {
      if (!user?.id || isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch enrollments
        const enrollments = await enrollmentService.getStudentEnrollments(user.id.toString()) as Array<{
          status: 'PENDING' | 'APPROVED' | 'REJECTED';
          progress: number;
          course: {
            duration?: string;
          };
        }>;

        const approvedEnrollments = enrollments.filter(e => e.status === 'APPROVED');
        const completedCourses = approvedEnrollments.filter(e => e.progress === 100);

        // Calculate hours learned from course durations
        let totalMinutes = 0;
        approvedEnrollments.forEach(enrollment => {
          const duration = enrollment.course.duration;
          if (duration) {
            // Parse duration like "10h 30m", "5h", "45m"
            const hourMatch = duration.match(/(\d+)h/);
            const minMatch = duration.match(/(\d+)m/);
            if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
            if (minMatch) totalMinutes += parseInt(minMatch[1]);
          }
        });
        const hoursLearned = Math.round(totalMinutes / 60);

        // Fetch quiz statistics
        const quizHistory = await quizService.getQuizHistory() as Array<{ score: number }>;
        const avgScore = quizHistory.length > 0
          ? Math.round(quizHistory.reduce((sum, attempt) => sum + attempt.score, 0) / quizHistory.length)
          : 0;

        setStats({
          coursesEnrolled: approvedEnrollments.length,
          coursesCompleted: completedCourses.length,
          quizzesTaken: quizHistory.length,
          avgScore,
          hoursLearned
        });
      } catch (err) {
        console.error('Failed to fetch student stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, [user, isAdmin]);

  if (!user) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">
          {isAdmin ? "Admin Profile" : "My Profile"}
        </h1>
        <p className="text-gray-600">Manage your profile and view your information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="size-32 bg-gradient-to-br from-[#1935CA] to-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {isAdmin && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Shield className="size-3" />
                    ADMIN
                  </div>
                )}
              </div>
              <h2 className="text-gray-800 text-center mb-1">{user.username}</h2>
              <p className="text-gray-500 text-center mb-1 capitalize">{user.role}</p>
              <p className="text-gray-500 text-center mb-4 text-sm">
                Member since {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-6 py-2 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
              >
                <Edit className="size-4" />
                Edit Profile
              </Link>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="size-5 text-[#1935CA]" />
                <span className="text-sm break-all">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="size-5 text-[#1935CA]" />
                <span className="text-sm">
                  Joined {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Statistics and Information */}
        <div className="lg:col-span-2 space-y-6">{isAdmin ? (
            // Admin-specific content
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-[#1935ca] mb-6">Admin Information</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="size-6 text-blue-600" />
                    <h3 className="text-gray-800">Administrator Access</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    You have full access to manage courses, users, questions, and quizzes.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-gray-800 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <Link to="/admin/dashboard" className="block text-sm text-[#1935ca] hover:underline">
                      → Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="block text-sm text-[#1935ca] hover:underline">
                      → Manage Users
                    </Link>
                    <Link to="/admin/courses" className="block text-sm text-[#1935ca] hover:underline">
                      → Manage Courses
                    </Link>
                    <Link to="/admin/questions" className="block text-sm text-[#1935ca] hover:underline">
                      → Manage Questions
                    </Link>
                    <Link to="/admin/quizzes" className="block text-sm text-[#1935ca] hover:underline">
                      → Manage Quizzes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Student-specific content
            <>
              {/* Statistics Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-[#1935ca] mb-6">Learning Statistics</h2>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-[#1935ca]" />
                    <span className="ml-2 text-gray-600">Loading statistics...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <BookOpen className="size-8 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Courses Enrolled</p>
                        <p className="text-2xl text-[#1935ca]">{stats.coursesEnrolled}</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Trophy className="size-8 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-2xl text-[#1935ca]">{stats.coursesCompleted}</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Brain className="size-8 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Quizzes Taken</p>
                        <p className="text-2xl text-[#1935ca]">{stats.quizzesTaken}</p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Target className="size-8 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                        <p className="text-2xl text-[#1935ca]">{stats.avgScore}%</p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Clock className="size-8 text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Hours Learned</p>
                        <p className="text-2xl text-[#1935ca]">{stats.hoursLearned}</p>
                      </div>
                    </div>

                    {stats.coursesEnrolled === 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500">
                        <p className="text-sm">Start taking courses and quizzes to see your statistics!</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-[#1935ca] mb-6">Recent Activity</h2>
                
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent activity yet</p>
                  <p className="text-xs mt-2">Your learning activity will appear here</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Brain, 
  TrendingUp, 
  UserPlus,
  Plus,
  ArrowRight,
  Activity
} from "lucide-react";
import { adminStats } from "../../lib/adminData";
import { userService, courseService, questionService } from "../../lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [users, courses, questions] = await Promise.all([
          userService.adminGetAllUsers(),
          courseService.getAllCourses(),
          questionService.getAllQuestions()
        ]);

        // Sort by createdAt and take the 5 most recent users
        const sortedUsers = (users as User[]).sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        
        setRecentUsers(sortedUsers);
        setTotalUsers((users as User[]).length);
        setTotalCourses((courses as any[]).length);
        setTotalQuestions((questions as any[]).length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and monitor your learning platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="size-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <TrendingUp className="size-4" />
              <span>+{adminStats.newUsersToday}</span>
            </div>
          </div>
          <p className="text-sm text-blue-100 mb-1">Total Users</p>
          <p className="text-3xl">{totalUsers.toLocaleString()}</p>
          <Link to="/admin/users" className="text-xs text-green-100 mt-2 hover:underline inline-flex items-center gap-1">
            Manage Users <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="size-10 opacity-80" />
          </div>
          <p className="text-sm text-green-100 mb-1">Total Courses</p>
          <p className="text-3xl">{totalCourses}</p>
          <Link to="/admin/courses" className="text-xs text-green-100 mt-2 hover:underline inline-flex items-center gap-1">
            Manage courses <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <HelpCircle className="size-10 opacity-80" />
          </div>
          <p className="text-sm text-purple-100 mb-1">Total Questions</p>
          <p className="text-3xl">{totalQuestions}</p>
          <Link to="/admin/questions" className="text-xs text-purple-100 mt-2 hover:underline inline-flex items-center gap-1">
            Manage questions <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Brain className="size-10 opacity-80" />
            <Activity className="size-8 opacity-60" />
          </div>
          <p className="text-sm text-orange-100 mb-1">Quizzes Taken</p>
          <p className="text-3xl">{adminStats.totalQuizzesTaken.toLocaleString()}</p>
          <p className="text-xs text-orange-100 mt-2">All time</p>
        </div>
      </div>

      {/* Quick Actions and Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-[#1935ca] mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/courses/new"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <Plus className="size-6 text-[#1935CA]" />
              </div>
              <span className="text-sm text-gray-700">Add Course</span>
            </Link>

            <Link
              to="/admin/questions/new"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <Plus className="size-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Add Question</span>
            </Link>
            
            <Link
              to="/admin/quiz/create"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <Plus className="size-6 text-[#1935CA]" />
              </div>
              <span className="text-sm text-gray-700">Add quizz</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                <Users className="size-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Manage Users</span>
            </Link>

            <Link
              to="/admin/courses"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <BookOpen className="size-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-700">Manage Courses</span>
            </Link>

            <Link
              to="/admin/quizzes"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1935CA] hover:bg-blue-50 transition-all group"
            >
              <div className="size-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors">
                <Brain className="size-6 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-700">Manage Quizzes</span>
            </Link>
          </div>
        </div>

        {/* Recent User Registrations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1935ca]">Recent Registrations</h2>
            <Link to="/admin/users" className="text-sm text-[#1935ca] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users registered yet</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <UserPlus className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 truncate">{user.username}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

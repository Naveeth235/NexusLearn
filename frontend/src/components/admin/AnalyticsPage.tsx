import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Calendar,
  ArrowUp,
  ArrowDown,
  Target,
  Clock,
  Loader2,
} from "lucide-react";

interface AnalyticsData {
  enrollmentsByMonth: { month: string; count: number }[];
  quizzesByCategory: { category: string; count: number; avgScore: number }[];
  topCourses: { id: number; title: string; enrollments: number; completionRate: number }[];
  userGrowth: { month: string; users: number }[];
  dailyActiveUsers: { day: string; count: number }[];
}

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true);
      
      // In real app, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - replace with actual API call
      setAnalytics({
        enrollmentsByMonth: [
          { month: "Jul", count: 45 },
          { month: "Aug", count: 62 },
          { month: "Sep", count: 78 },
          { month: "Oct", count: 95 },
          { month: "Nov", count: 112 },
          { month: "Dec", count: 134 },
        ],
        quizzesByCategory: [
          { category: "Data Structures", count: 156, avgScore: 72 },
          { category: "Cloud Computing", count: 89, avgScore: 68 },
          { category: "Cyber Security", count: 134, avgScore: 75 },
          { category: "Machine Learning", count: 67, avgScore: 65 },
          { category: "Web Development", count: 201, avgScore: 78 },
        ],
        topCourses: [
          { id: 1, title: "Introduction to Python", enrollments: 245, completionRate: 68 },
          { id: 2, title: "Web Development Basics", enrollments: 198, completionRate: 72 },
          { id: 3, title: "Data Structures & Algorithms", enrollments: 176, completionRate: 54 },
          { id: 4, title: "Cloud Computing Fundamentals", enrollments: 134, completionRate: 61 },
          { id: 5, title: "Cyber Security Essentials", enrollments: 112, completionRate: 58 },
        ],
        userGrowth: [
          { month: "Jul", users: 1200 },
          { month: "Aug", users: 1450 },
          { month: "Sep", users: 1680 },
          { month: "Oct", users: 1920 },
          { month: "Nov", users: 2150 },
          { month: "Dec", users: 2456 },
        ],
        dailyActiveUsers: [
          { day: "Mon", count: 342 },
          { day: "Tue", count: 398 },
          { day: "Wed", count: 412 },
          { day: "Thu", count: 385 },
          { day: "Fri", count: 367 },
          { day: "Sat", count: 234 },
          { day: "Sun", count: 198 },
        ],
      });
      
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  const maxEnrollment = analytics
    ? Math.max(...analytics.enrollmentsByMonth.map((e) => e.count))
    : 0;

  const maxDAU = analytics
    ? Math.max(...analytics.dailyActiveUsers.map((d) => d.count))
    : 0;

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1935ca] mb-2">Analytics</h1>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-[#1935CA] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="size-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="size-4" />
              <span>12.5%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-[#1935ca]">2,456</p>
          <p className="text-xs text-gray-500 mt-1">+156 this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="size-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="size-4" />
              <span>8.2%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Enrollments</p>
          <p className="text-2xl font-bold text-[#1935ca]">1,234</p>
          <p className="text-xs text-gray-500 mt-1">Across 48 courses</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="size-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="size-4" />
              <span>15.3%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Quizzes Completed</p>
          <p className="text-2xl font-bold text-[#1935ca]">8,567</p>
          <p className="text-xs text-gray-500 mt-1">71% avg. score</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="size-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <ArrowDown className="size-4" />
              <span>2.1%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-[#1935ca]">64%</p>
          <p className="text-xs text-gray-500 mt-1">Course completions</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollments Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Enrollments</h2>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4">
            {analytics?.enrollmentsByMonth.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-[#1935CA] to-blue-400 rounded-t-lg transition-all hover:from-[#152a9e] hover:to-blue-500"
                  style={{ height: `${(item.count / maxEnrollment) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Active Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Daily Active Users</h2>
            <Clock className="size-5 text-blue-500" />
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4">
            {analytics?.dailyActiveUsers.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500"
                  style={{ height: `${(item.count / maxDAU) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Courses</h2>
          
          <div className="space-y-4">
            {analytics?.topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center gap-4">
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === 0 ? "bg-yellow-100 text-yellow-700" :
                  index === 1 ? "bg-gray-100 text-gray-600" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-50 text-gray-500"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{course.title}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{course.enrollments} enrollments</span>
                    <span>{course.completionRate}% completion</span>
                  </div>
                </div>
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1935CA] h-2 rounded-full"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Performance by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quiz Performance by Category</h2>
          
          <div className="space-y-4">
            {analytics?.quizzesByCategory.map((category) => (
              <div key={category.category} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800">{category.category}</p>
                    <span className="text-sm text-gray-600">{category.avgScore}% avg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        category.avgScore >= 75 ? "bg-green-500" :
                        category.avgScore >= 60 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${category.avgScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{category.count} quizzes taken</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

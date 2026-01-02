import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Medal,
  Star,
  Target,
  Zap,
  BookOpen,
  Brain,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { enrollmentService } from "../../lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "courses" | "quizzes" | "streaks" | "milestones";
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch user's enrollments to calculate progress
        const enrollments = (await enrollmentService.getStudentEnrollments(
          user.id.toString()
        )) as Array<{ progress: number; status: string }>;

        const completedCourses = enrollments.filter(
          (e) => e.progress === 100 && e.status === "APPROVED"
        ).length;
        const enrolledCourses = enrollments.filter(
          (e) => e.status === "APPROVED"
        ).length;

        // Get quiz history from localStorage (or API in real app)
        const quizHistory = JSON.parse(
          localStorage.getItem("quizHistory") || "[]"
        ) as Array<{ score: number }>;
        const totalQuizzes = quizHistory.length;
        const perfectQuizzes = quizHistory.filter((q) => q.score === 100).length;
        const passedQuizzes = quizHistory.filter((q) => q.score >= 70).length;

        // Get learning streak from localStorage
        const currentStreak = parseInt(
          localStorage.getItem("learningStreak") || "0"
        );

        // Define all achievements
        const allAchievements: Achievement[] = [
          // Course achievements
          {
            id: "first-course",
            title: "First Steps",
            description: "Enroll in your first course",
            icon: <BookOpen className="size-6" />,
            category: "courses",
            requirement: 1,
            progress: enrolledCourses,
            unlocked: enrolledCourses >= 1,
            rarity: "common",
          },
          {
            id: "course-completer",
            title: "Course Completer",
            description: "Complete your first course",
            icon: <CheckCircle className="size-6" />,
            category: "courses",
            requirement: 1,
            progress: completedCourses,
            unlocked: completedCourses >= 1,
            rarity: "common",
          },
          {
            id: "knowledge-seeker",
            title: "Knowledge Seeker",
            description: "Complete 5 courses",
            icon: <Target className="size-6" />,
            category: "courses",
            requirement: 5,
            progress: completedCourses,
            unlocked: completedCourses >= 5,
            rarity: "rare",
          },
          {
            id: "course-master",
            title: "Course Master",
            description: "Complete 10 courses",
            icon: <Medal className="size-6" />,
            category: "courses",
            requirement: 10,
            progress: completedCourses,
            unlocked: completedCourses >= 10,
            rarity: "epic",
          },
          {
            id: "scholar",
            title: "Scholar",
            description: "Complete 25 courses",
            icon: <Award className="size-6" />,
            category: "courses",
            requirement: 25,
            progress: completedCourses,
            unlocked: completedCourses >= 25,
            rarity: "legendary",
          },

          // Quiz achievements
          {
            id: "quiz-taker",
            title: "Quiz Taker",
            description: "Complete your first quiz",
            icon: <Brain className="size-6" />,
            category: "quizzes",
            requirement: 1,
            progress: totalQuizzes,
            unlocked: totalQuizzes >= 1,
            rarity: "common",
          },
          {
            id: "quiz-enthusiast",
            title: "Quiz Enthusiast",
            description: "Complete 10 quizzes",
            icon: <Brain className="size-6" />,
            category: "quizzes",
            requirement: 10,
            progress: totalQuizzes,
            unlocked: totalQuizzes >= 10,
            rarity: "rare",
          },
          {
            id: "perfectionist",
            title: "Perfectionist",
            description: "Score 100% on a quiz",
            icon: <Star className="size-6" />,
            category: "quizzes",
            requirement: 1,
            progress: perfectQuizzes,
            unlocked: perfectQuizzes >= 1,
            rarity: "rare",
          },
          {
            id: "quiz-master",
            title: "Quiz Master",
            description: "Score 100% on 5 quizzes",
            icon: <Trophy className="size-6" />,
            category: "quizzes",
            requirement: 5,
            progress: perfectQuizzes,
            unlocked: perfectQuizzes >= 5,
            rarity: "epic",
          },
          {
            id: "consistent-learner",
            title: "Consistent Learner",
            description: "Pass 20 quizzes",
            icon: <TrendingUp className="size-6" />,
            category: "quizzes",
            requirement: 20,
            progress: passedQuizzes,
            unlocked: passedQuizzes >= 20,
            rarity: "epic",
          },

          // Streak achievements
          {
            id: "getting-started",
            title: "Getting Started",
            description: "Learn for 3 consecutive days",
            icon: <Zap className="size-6" />,
            category: "streaks",
            requirement: 3,
            progress: currentStreak,
            unlocked: currentStreak >= 3,
            rarity: "common",
          },
          {
            id: "week-warrior",
            title: "Week Warrior",
            description: "7-day learning streak",
            icon: <Zap className="size-6" />,
            category: "streaks",
            requirement: 7,
            progress: currentStreak,
            unlocked: currentStreak >= 7,
            rarity: "rare",
          },
          {
            id: "dedicated-learner",
            title: "Dedicated Learner",
            description: "30-day learning streak",
            icon: <Clock className="size-6" />,
            category: "streaks",
            requirement: 30,
            progress: currentStreak,
            unlocked: currentStreak >= 30,
            rarity: "epic",
          },
          {
            id: "unstoppable",
            title: "Unstoppable",
            description: "100-day learning streak",
            icon: <Zap className="size-6" />,
            category: "streaks",
            requirement: 100,
            progress: currentStreak,
            unlocked: currentStreak >= 100,
            rarity: "legendary",
          },

          // Milestones
          {
            id: "early-bird",
            title: "Early Bird",
            description: "Complete a lesson before 8 AM",
            icon: <Clock className="size-6" />,
            category: "milestones",
            requirement: 1,
            progress: 0,
            unlocked: false,
            rarity: "rare",
          },
          {
            id: "night-owl",
            title: "Night Owl",
            description: "Complete a lesson after 10 PM",
            icon: <Clock className="size-6" />,
            category: "milestones",
            requirement: 1,
            progress: 0,
            unlocked: false,
            rarity: "rare",
          },
        ];

        setAchievements(allAchievements);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user]);

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-500";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
    }
  };

  const getRarityBorder = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300";
      case "rare":
        return "border-blue-300";
      case "epic":
        return "border-purple-300";
      case "legendary":
        return "border-yellow-300";
    }
  };

  const getRarityBg = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-50";
      case "rare":
        return "bg-blue-50";
      case "epic":
        return "bg-purple-50";
      case "legendary":
        return "bg-gradient-to-r from-yellow-50 to-orange-50";
    }
  };

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "unlocked" && !achievement.unlocked) return false;
    if (filter === "locked" && achievement.unlocked) return false;
    if (categoryFilter !== "all" && achievement.category !== categoryFilter)
      return false;
    return true;
  });

  // Calculate stats
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: "all", label: "All", icon: <Trophy className="size-4" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="size-4" /> },
    { id: "quizzes", label: "Quizzes", icon: <Brain className="size-4" /> },
    { id: "streaks", label: "Streaks", icon: <Zap className="size-4" /> },
    { id: "milestones", label: "Milestones", icon: <Medal className="size-4" /> },
  ];

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
          <span className="ml-2 text-gray-600">Loading achievements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Achievements</h1>
        <p className="text-gray-600">
          Track your progress and unlock rewards as you learn
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-[#1935CA] to-blue-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Progress</h2>
            <p className="text-blue-100">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="size-20 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="size-10 text-yellow-300" />
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-yellow-400 h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-blue-100 mt-2">{progressPercentage}% complete</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            {(["all", "unlocked", "locked"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-[#1935CA] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "unlocked"
                  ? `Unlocked (${unlockedCount})`
                  : `Locked (${totalCount - unlockedCount})`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 md:ml-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  categoryFilter === cat.id
                    ? "bg-blue-100 text-[#1935CA]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl p-6 border-2 transition-all ${
              achievement.unlocked
                ? `${getRarityBg(achievement.rarity)} ${getRarityBorder(
                    achievement.rarity
                  )} hover:shadow-lg`
                : "bg-gray-50 border-gray-200 opacity-70"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`size-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${getRarityColor(
                        achievement.rarity
                      )} text-white shadow-lg`
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {achievement.unlocked ? achievement.icon : <Lock className="size-6" />}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-semibold ${
                      achievement.unlocked ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      achievement.rarity === "legendary"
                        ? "bg-yellow-100 text-yellow-700"
                        : achievement.rarity === "epic"
                        ? "bg-purple-100 text-purple-700"
                        : achievement.rarity === "rare"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {achievement.rarity}
                  </span>
                </div>
                <p
                  className={`text-sm mb-3 ${
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {achievement.progress} / {achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#1935CA] h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (achievement.progress / achievement.requirement) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-gray-500">
                    Unlocked on{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Trophy className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No achievements found
          </h3>
          <p className="text-gray-500">
            {filter === "unlocked"
              ? "You haven't unlocked any achievements yet. Keep learning!"
              : "Try adjusting your filters"}
          </p>
          {filter === "unlocked" && (
            <Link
              to="/courses"
              className="inline-block mt-4 bg-[#1935CA] text-white px-6 py-2 rounded-lg hover:bg-[#152a9e] transition-colors"
            >
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

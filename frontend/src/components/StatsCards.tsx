import { BookOpen, Brain, TrendingUp } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      icon: <BookOpen className="size-6" />,
      label: "Courses Enrolled",
      value: "27",
      change: "+3 this month",
      color: "bg-blue-500"
    },
    {
      icon: <Brain className="size-6" />,
      label: "Quizzes Taken",
      value: "200",
      change: "+15 this week",
      color: "bg-purple-500"
    },
    {
      icon: <TrendingUp className="size-6" />,
      label: "Average Score",
      value: "85%",
      change: "+5% improvement",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} text-white p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-gray-600 mb-1">{stat.label}</p>
          <div className="flex items-end justify-between">
            <p className="text-[#1935ca]">{stat.value}</p>
            <span className="text-sm text-green-600">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

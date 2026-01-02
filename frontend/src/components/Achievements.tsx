import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Achievements() {
  const achievements = [
    {
      id: 1,
      title: "Quick Learner",
      description: "Complete 10 courses",
      icon: "🎓",
      date: "2023-10-01"
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Score 100% in 5 quizzes",
      icon: "🏆",
      date: "2023-10-05"
    },
    {
      id: 3,
      title: "Consistent Learner",
      description: "7-day learning streak",
      icon: "🔥",
      date: "2023-10-10"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <h2 className="text-[#1935ca] mb-6">Recent Achievements</h2>
      
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100 hover:shadow-md transition-all group hover:scale-[1.01]"
          >
            <div className="size-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200 text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all">
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 mb-1 group-hover:text-[#1935ca] transition-colors">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              <p className="text-xs text-orange-600 mt-1">Earned {achievement.date}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Link 
        to="/achievements" 
        className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all group"
      >
        View All Achievements
        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
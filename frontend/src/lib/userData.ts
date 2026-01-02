import imgRectangle301 from "figma:asset/09146eec5358a1198ed8284f4d9862814c9baf37.png";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio?: string;
  stats: {
    coursesEnrolled: number;
    quizzesTaken: number;
    averageScore: number;
    completedCourses: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

export const currentUser: UserProfile = {
  id: "1",
  username: "Michael Clifford",
  email: "michael.clifford@example.com",
  avatar: imgRectangle301,
  joinDate: "2024-01-15",
  bio: "Passionate learner focused on cybersecurity and data structures. Always eager to expand my knowledge and take on new challenges.",
  stats: {
    coursesEnrolled: 27,
    quizzesTaken: 200,
    averageScore: 85,
    completedCourses: 12
  },
  achievements: [
    {
      id: "1",
      title: "Quick Learner",
      description: "Complete 5 courses in a month",
      icon: "⚡",
      earnedDate: "2024-11-20",
      category: "Learning"
    },
    {
      id: "2",
      title: "Quiz Master",
      description: "Score 100% on 10 quizzes",
      icon: "🎯",
      earnedDate: "2024-11-15",
      category: "Quiz"
    },
    {
      id: "3",
      title: "Data Structure Expert",
      description: "Complete all Data Structure courses",
      icon: "💾",
      earnedDate: "2024-11-10",
      category: "Course"
    },
    {
      id: "4",
      title: "Security Champion",
      description: "Complete 5 Cyber Security courses",
      icon: "🔒",
      earnedDate: "2024-11-05",
      category: "Course"
    },
    {
      id: "5",
      title: "Consistent Learner",
      description: "Log in for 30 consecutive days",
      icon: "📅",
      earnedDate: "2024-10-28",
      category: "Engagement"
    },
    {
      id: "6",
      title: "Perfect Score",
      description: "Achieve 100% on a quiz",
      icon: "⭐",
      earnedDate: "2024-10-15",
      category: "Quiz"
    }
  ]
};

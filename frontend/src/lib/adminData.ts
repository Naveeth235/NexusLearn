export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalQuestions: number;
  totalQuizzesTaken: number;
  newUsersToday: number;
  activeUsers: number;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  registrationDate: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  coursesEnrolled: number;
  lastLogin: string;
}

export interface CourseManagement {
  id: string;
  courseName: string;
  category: string;
  enrolledUsers: number;
  createdAt: string;
  status: "Published" | "Draft";
  instructor: string;
}

export interface RecentUser {
  id: string;
  username: string;
  email: string;
  registeredAt: string;
  avatar?: string;
}

export const adminStats: AdminStats = {
  totalUsers: 1247,
  totalCourses: 48,
  totalQuestions: 324,
  totalQuizzesTaken: 8956,
  newUsersToday: 23,
  activeUsers: 892
};

export const recentUsers: RecentUser[] = [
  {
    id: "1",
    username: "Sarah Johnson",
    email: "sarah.j@example.com",
    registeredAt: "2024-12-24T09:30:00"
  },
  {
    id: "2",
    username: "James Wilson",
    email: "james.w@example.com",
    registeredAt: "2024-12-24T08:15:00"
  },
  {
    id: "3",
    username: "Emma Davis",
    email: "emma.d@example.com",
    registeredAt: "2024-12-23T16:45:00"
  },
  {
    id: "4",
    username: "Michael Brown",
    email: "michael.b@example.com",
    registeredAt: "2024-12-23T14:20:00"
  },
  {
    id: "5",
    username: "Olivia Martinez",
    email: "olivia.m@example.com",
    registeredAt: "2024-12-23T11:10:00"
  }
];

export const usersData: UserData[] = [
  {
    id: "1",
    username: "Michael Clifford",
    email: "michael.clifford@example.com",
    registrationDate: "2024-01-15T10:00:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 27,
    lastLogin: "2024-12-24T09:00:00"
  },
  {
    id: "2",
    username: "Admin User",
    email: "admin@cyberverdict.com",
    registrationDate: "2023-12-01T10:00:00",
    role: "Admin",
    status: "Active",
    coursesEnrolled: 5,
    lastLogin: "2024-12-24T10:30:00"
  },
  {
    id: "3",
    username: "Sarah Johnson",
    email: "sarah.j@example.com",
    registrationDate: "2024-12-24T09:30:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 3,
    lastLogin: "2024-12-24T09:45:00"
  },
  {
    id: "4",
    username: "James Wilson",
    email: "james.w@example.com",
    registrationDate: "2024-12-24T08:15:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 5,
    lastLogin: "2024-12-24T10:00:00"
  },
  {
    id: "5",
    username: "Emma Davis",
    email: "emma.d@example.com",
    registrationDate: "2024-11-10T14:30:00",
    role: "User",
    status: "Inactive",
    coursesEnrolled: 12,
    lastLogin: "2024-11-28T16:20:00"
  },
  {
    id: "6",
    username: "Robert Taylor",
    email: "robert.t@example.com",
    registrationDate: "2024-10-05T11:15:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 18,
    lastLogin: "2024-12-23T15:30:00"
  },
  {
    id: "7",
    username: "Lisa Anderson",
    email: "lisa.a@example.com",
    registrationDate: "2024-09-20T09:00:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 22,
    lastLogin: "2024-12-24T08:00:00"
  },
  {
    id: "8",
    username: "David Martinez",
    email: "david.m@example.com",
    registrationDate: "2024-08-12T13:45:00",
    role: "User",
    status: "Active",
    coursesEnrolled: 15,
    lastLogin: "2024-12-23T19:15:00"
  }
];

export const coursesManagement: CourseManagement[] = [
  {
    id: "1",
    courseName: "Data Structures Fundamentals",
    category: "Data Structure",
    enrolledUsers: 456,
    createdAt: "2024-01-10T10:00:00",
    status: "Published",
    instructor: "Dr. John Smith"
  },
  {
    id: "2",
    courseName: "Advanced Cloud Computing",
    category: "Cloud Computing",
    enrolledUsers: 328,
    createdAt: "2024-02-15T10:00:00",
    status: "Published",
    instructor: "Prof. Sarah Lee"
  },
  {
    id: "3",
    courseName: "Cyber Security Essentials",
    category: "Cyber Security",
    enrolledUsers: 892,
    createdAt: "2024-01-20T10:00:00",
    status: "Published",
    instructor: "Dr. Michael Chen"
  },
  {
    id: "4",
    courseName: "Machine Learning Basics",
    category: "Machine Learning",
    enrolledUsers: 567,
    createdAt: "2024-03-05T10:00:00",
    status: "Published",
    instructor: "Prof. Emily Wang"
  },
  {
    id: "5",
    courseName: "Web Development Masterclass",
    category: "Web Development",
    enrolledUsers: 743,
    createdAt: "2024-02-01T10:00:00",
    status: "Published",
    instructor: "Dr. Alex Johnson"
  },
  {
    id: "6",
    courseName: "Introduction to DevOps",
    category: "DevOps",
    enrolledUsers: 234,
    createdAt: "2024-11-15T10:00:00",
    status: "Draft",
    instructor: "Prof. David Brown"
  }
];

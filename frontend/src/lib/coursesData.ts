export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  image: string;
  duration: string;
  lessons: number;
  students: number;
  badge?: string;
  instructor: string;
  level: string;
  enrolled?: boolean;
  progress?: number;
  rating: number;
  prerequisites?: string[];
  modules: Module[];
  relatedQuizzes: Quiz[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  completed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  duration: string;
  passingScore: number;
}

// Categories for filtering
export const categories = [
  "All Categories",
  "Data Structure",
  "Cloud Computing",
  "Cyber Security",
  "Web Development",
  "Machine Learning",
  "Mobile Development",
  "Database",
  "DevOps",
  "Blockchain",
  "Design"
];

// Placeholder data for legacy components (will be replaced by API data)
export const coursesData: Course[] = [];

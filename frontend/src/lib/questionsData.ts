export interface Question {
  id: string;
  questionText: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export const questionsData: Question[] = [
  {
    id: "1",
    questionText: "Which data structure uses LIFO (Last In First Out) principle?",
    category: "Data Structure",
    difficulty: "Easy",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "A Stack follows the LIFO principle where the last element added is the first one to be removed.",
    createdAt: "2024-12-01T10:00:00",
    updatedAt: "2024-12-01T10:00:00"
  },
  {
    id: "2",
    questionText: "What is the time complexity of accessing an element in an array by index?",
    category: "Data Structure",
    difficulty: "Easy",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctAnswer: 2,
    explanation: "Accessing an array element by index is O(1) because we can directly compute the memory address.",
    createdAt: "2024-12-02T10:00:00",
    updatedAt: "2024-12-02T10:00:00"
  },
  {
    id: "3",
    questionText: "Which cloud service model provides the most control over the infrastructure?",
    category: "Cloud Computing",
    difficulty: "Medium",
    options: ["SaaS", "PaaS", "IaaS", "FaaS"],
    correctAnswer: 2,
    explanation: "Infrastructure as a Service (IaaS) provides the most control, allowing you to manage virtual machines, storage, and networks.",
    createdAt: "2024-12-03T10:00:00",
    updatedAt: "2024-12-03T10:00:00"
  },
  {
    id: "4",
    questionText: "What type of attack involves tricking users into revealing sensitive information?",
    category: "Cyber Security",
    difficulty: "Medium",
    options: ["DDoS", "Phishing", "SQL Injection", "Man-in-the-Middle"],
    correctAnswer: 1,
    explanation: "Phishing is a social engineering attack where attackers deceive users into providing sensitive data.",
    createdAt: "2024-12-04T10:00:00",
    updatedAt: "2024-12-04T10:00:00"
  },
  {
    id: "5",
    questionText: "Which encryption method uses the same key for encryption and decryption?",
    category: "Cyber Security",
    difficulty: "Hard",
    options: ["Asymmetric encryption", "Symmetric encryption", "Hash function", "Digital signature"],
    correctAnswer: 1,
    explanation: "Symmetric encryption uses the same key for both encryption and decryption operations.",
    createdAt: "2024-12-05T10:00:00",
    updatedAt: "2024-12-05T10:00:00"
  },
  {
    id: "6",
    questionText: "Which HTML tag is used to define an internal style sheet?",
    category: "Web Development",
    difficulty: "Easy",
    options: ["<css>", "<style>", "<script>", "<link>"],
    correctAnswer: 1,
    explanation: "The <style> tag is used to define internal CSS within an HTML document.",
    createdAt: "2024-12-06T10:00:00",
    updatedAt: "2024-12-06T10:00:00"
  },
  {
    id: "7",
    questionText: "Which type of learning involves training a model with labeled data?",
    category: "Machine Learning",
    difficulty: "Medium",
    options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
    correctAnswer: 1,
    explanation: "Supervised learning uses labeled data where each input has a corresponding correct output.",
    createdAt: "2024-12-07T10:00:00",
    updatedAt: "2024-12-07T10:00:00"
  },
  {
    id: "8",
    questionText: "What is the time complexity of the QuickSort algorithm in the average case?",
    category: "Data Structure",
    difficulty: "Hard",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    explanation: "QuickSort has an average time complexity of O(n log n) with random pivot selection.",
    createdAt: "2024-12-08T10:00:00",
    updatedAt: "2024-12-08T10:00:00"
  },
  {
    id: "9",
    questionText: "What does 'elasticity' mean in cloud computing?",
    category: "Cloud Computing",
    difficulty: "Medium",
    options: [
      "The ability to recover from failures",
      "The ability to scale resources up or down automatically",
      "The ability to distribute workload across regions",
      "The ability to encrypt data at rest"
    ],
    correctAnswer: 1,
    explanation: "Elasticity refers to the automatic scaling of resources based on demand.",
    createdAt: "2024-12-09T10:00:00",
    updatedAt: "2024-12-09T10:00:00"
  },
  {
    id: "10",
    questionText: "Which of the following is NOT a component of the CIA triad?",
    category: "Cyber Security",
    difficulty: "Easy",
    options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
    correctAnswer: 3,
    explanation: "The CIA triad consists of Confidentiality, Integrity, and Availability. Authentication is separate.",
    createdAt: "2024-12-10T10:00:00",
    updatedAt: "2024-12-10T10:00:00"
  }
];

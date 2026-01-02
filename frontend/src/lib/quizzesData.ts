export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface QuizAttempt {
  quizId: string;
  quizTitle: string;
  category: string;
  dateTaken: string;
  score: number;
  totalQuestions: number;
  userAnswers: (number | null)[];
  timeTaken?: number; // in seconds
}

export const quizzesData: Quiz[] = [
  {
    id: "1",
    title: "Data Structure Basics",
    category: "Data Structure",
    description: "Test your knowledge of fundamental data structures including arrays, linked lists, stacks, and queues.",
    timeLimit: 30,
    passingScore: 70,
    difficulty: "Easy",
    questions: [
      {
        id: "q1",
        question: "Which data structure uses LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "A Stack follows the LIFO principle where the last element added is the first one to be removed."
      },
      {
        id: "q2",
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Accessing an array element by index is O(1) because we can directly compute the memory address."
      },
      {
        id: "q3",
        question: "Which data structure is best suited for implementing a priority queue?",
        options: ["Array", "Linked List", "Heap", "Stack"],
        correctAnswer: 2,
        explanation: "A Heap is the most efficient data structure for implementing a priority queue with O(log n) insertion and deletion."
      },
      {
        id: "q4",
        question: "In a singly linked list, which operation has O(n) time complexity?",
        options: ["Insert at beginning", "Delete first node", "Access last node", "Insert after a given node"],
        correctAnswer: 2,
        explanation: "Accessing the last node requires traversing through all nodes, making it O(n)."
      },
      {
        id: "q5",
        question: "What is the main advantage of a linked list over an array?",
        options: ["Faster access time", "Dynamic size", "Better cache locality", "Lower memory usage"],
        correctAnswer: 1,
        explanation: "Linked lists can grow or shrink dynamically without needing to allocate a fixed size upfront."
      }
    ]
  },
  {
    id: "2",
    title: "Cloud Computing Fundamentals",
    category: "Cloud Computing",
    description: "Evaluate your understanding of cloud computing concepts, service models, and major cloud platforms.",
    timeLimit: 40,
    passingScore: 70,
    difficulty: "Medium",
    questions: [
      {
        id: "q1",
        question: "Which cloud service model provides the most control over the infrastructure?",
        options: ["SaaS", "PaaS", "IaaS", "FaaS"],
        correctAnswer: 2,
        explanation: "Infrastructure as a Service (IaaS) provides the most control, allowing you to manage virtual machines, storage, and networks."
      },
      {
        id: "q2",
        question: "What does 'elasticity' mean in cloud computing?",
        options: [
          "The ability to recover from failures",
          "The ability to scale resources up or down automatically",
          "The ability to distribute workload across regions",
          "The ability to encrypt data at rest"
        ],
        correctAnswer: 1,
        explanation: "Elasticity refers to the automatic scaling of resources based on demand."
      },
      {
        id: "q3",
        question: "Which AWS service is used for object storage?",
        options: ["EC2", "S3", "RDS", "Lambda"],
        correctAnswer: 1,
        explanation: "Amazon S3 (Simple Storage Service) is designed for object storage in the cloud."
      },
      {
        id: "q4",
        question: "What is a virtual private cloud (VPC)?",
        options: [
          "A type of virtual machine",
          "An isolated network within a cloud provider",
          "A cloud storage service",
          "A container orchestration platform"
        ],
        correctAnswer: 1,
        explanation: "A VPC is a logically isolated section of the cloud where you can launch resources in a virtual network."
      },
      {
        id: "q5",
        question: "Which deployment model involves sharing infrastructure among multiple organizations?",
        options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Cloud"],
        correctAnswer: 3,
        explanation: "A Community Cloud is shared by several organizations with common concerns."
      }
    ]
  },
  {
    id: "3",
    title: "Cyber Security Essentials",
    category: "Cyber Security",
    description: "Test your knowledge of cybersecurity principles, threats, and defense mechanisms.",
    timeLimit: 45,
    passingScore: 80,
    difficulty: "Hard",
    questions: [
      {
        id: "q1",
        question: "What type of attack involves tricking users into revealing sensitive information?",
        options: ["DDoS", "Phishing", "SQL Injection", "Man-in-the-Middle"],
        correctAnswer: 1,
        explanation: "Phishing is a social engineering attack where attackers deceive users into providing sensitive data."
      },
      {
        id: "q2",
        question: "Which encryption method uses the same key for encryption and decryption?",
        options: ["Asymmetric encryption", "Symmetric encryption", "Hash function", "Digital signature"],
        correctAnswer: 1,
        explanation: "Symmetric encryption uses the same key for both encryption and decryption operations."
      },
      {
        id: "q3",
        question: "What is the primary purpose of a firewall?",
        options: [
          "To encrypt data",
          "To filter network traffic",
          "To detect malware",
          "To backup data"
        ],
        correctAnswer: 1,
        explanation: "A firewall filters incoming and outgoing network traffic based on predetermined security rules."
      },
      {
        id: "q4",
        question: "Which of the following is NOT a component of the CIA triad?",
        options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
        correctAnswer: 3,
        explanation: "The CIA triad consists of Confidentiality, Integrity, and Availability. Authentication is separate."
      },
      {
        id: "q5",
        question: "What does a VPN primarily provide?",
        options: [
          "Faster internet speed",
          "Secure encrypted connection over a public network",
          "Unlimited bandwidth",
          "Ad blocking"
        ],
        correctAnswer: 1,
        explanation: "A VPN creates an encrypted tunnel for secure communication over public networks."
      },
      {
        id: "q6",
        question: "Which type of malware is designed to deny access to files until a ransom is paid?",
        options: ["Trojan", "Worm", "Ransomware", "Spyware"],
        correctAnswer: 2,
        explanation: "Ransomware encrypts files and demands payment for the decryption key."
      }
    ]
  },
  {
    id: "4",
    title: "Web Development Basics",
    category: "Web Development",
    description: "Quiz covering HTML, CSS, and JavaScript fundamentals for web development.",
    passingScore: 70,
    difficulty: "Easy",
    questions: [
      {
        id: "q1",
        question: "Which HTML tag is used to define an internal style sheet?",
        options: ["<css>", "<style>", "<script>", "<link>"],
        correctAnswer: 1,
        explanation: "The <style> tag is used to define internal CSS within an HTML document."
      },
      {
        id: "q2",
        question: "What does CSS stand for?",
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets"
        ],
        correctAnswer: 1,
        explanation: "CSS stands for Cascading Style Sheets, used for styling web pages."
      },
      {
        id: "q3",
        question: "Which JavaScript method is used to select an element by its ID?",
        options: [
          "getElementByClass()",
          "querySelector()",
          "getElementById()",
          "selectElement()"
        ],
        correctAnswer: 2,
        explanation: "getElementById() is the method specifically designed to select elements by their ID attribute."
      },
      {
        id: "q4",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctAnswer: 2,
        explanation: "<h1> defines the largest and most important heading."
      }
    ]
  },
  {
    id: "5",
    title: "Machine Learning Fundamentals",
    category: "Machine Learning",
    description: "Assess your understanding of machine learning concepts, algorithms, and applications.",
    timeLimit: 50,
    passingScore: 75,
    difficulty: "Hard",
    questions: [
      {
        id: "q1",
        question: "Which type of learning involves training a model with labeled data?",
        options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
        correctAnswer: 1,
        explanation: "Supervised learning uses labeled data where each input has a corresponding correct output."
      },
      {
        id: "q2",
        question: "What is overfitting in machine learning?",
        options: [
          "Model performs well on training data but poorly on new data",
          "Model performs poorly on all data",
          "Model takes too long to train",
          "Model uses too much memory"
        ],
        correctAnswer: 0,
        explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize."
      },
      {
        id: "q3",
        question: "Which algorithm is primarily used for classification tasks?",
        options: ["K-Means", "Linear Regression", "Decision Trees", "PCA"],
        correctAnswer: 2,
        explanation: "Decision Trees are commonly used for both classification and regression, but are particularly popular for classification."
      }
    ]
  },
  {
    id: "6",
    title: "Advanced Algorithms",
    category: "Data Structure",
    description: "Challenge yourself with advanced algorithmic concepts and problem-solving techniques.",
    timeLimit: 60,
    passingScore: 75,
    difficulty: "Hard",
    questions: [
      {
        id: "q1",
        question: "What is the time complexity of the QuickSort algorithm in the average case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "QuickSort has an average time complexity of O(n log n) with random pivot selection."
      },
      {
        id: "q2",
        question: "Which algorithm is used to find the shortest path in a weighted graph?",
        options: ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm", "Binary Search"],
        correctAnswer: 2,
        explanation: "Dijkstra's Algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph."
      }
    ]
  }
];

// Mock quiz history data
export const quizHistory: QuizAttempt[] = [
  {
    quizId: "1",
    quizTitle: "Data Structure Basics",
    category: "Data Structure",
    dateTaken: "2024-12-20T10:30:00",
    score: 92,
    totalQuestions: 5,
    userAnswers: [1, 2, 2, 2, 1],
    timeTaken: 1200
  },
  {
    quizId: "2",
    quizTitle: "Cloud Computing Fundamentals",
    category: "Cloud Computing",
    dateTaken: "2024-12-18T14:15:00",
    score: 88,
    totalQuestions: 5,
    userAnswers: [2, 1, 1, 1, 3],
    timeTaken: 1800
  },
  {
    quizId: "3",
    quizTitle: "Cyber Security Essentials",
    category: "Cyber Security",
    dateTaken: "2024-12-15T09:45:00",
    score: 75,
    totalQuestions: 6,
    userAnswers: [1, 1, 1, 3, 1, 2],
    timeTaken: 2400
  },
  {
    quizId: "4",
    quizTitle: "Web Development Basics",
    category: "Web Development",
    dateTaken: "2024-12-14T16:20:00",
    score: 100,
    totalQuestions: 4,
    userAnswers: [1, 1, 2, 2],
    timeTaken: 600
  }
];

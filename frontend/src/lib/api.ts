/**
 * API Configuration and Endpoints
 * 
 * All API requests should go through the API Gateway
 * Base URL: Configure based on your environment
 */

// API Gateway Base URL - Update this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8765/api';

/**
 * API Endpoints organized by service
 */
export const API_ENDPOINTS = {
  // User Management Service
  USER: {
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users/register`,
    PROFILE: `${API_BASE_URL}/users/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/me`,
    DELETE_ACCOUNT: `${API_BASE_URL}/users/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/me/password`,
    // Admin endpoints
    ADMIN_GET_ALL: `${API_BASE_URL}/users/admin/all`,
    ADMIN_GET_BY_ID: (id: number) => `${API_BASE_URL}/users/admin/${id}`,
    ADMIN_DELETE: (id: number) => `${API_BASE_URL}/users/admin/${id}`,
    ADMIN_ACTIVATE: (id: number) => `${API_BASE_URL}/users/admin/${id}/activate`,
    ADMIN_DEACTIVATE: (id: number) => `${API_BASE_URL}/users/admin/${id}/deactivate`,
  },

  // Course Service
  COURSE: {
    GET_ALL_COURSES: `${API_BASE_URL}/courses`,
    GET_COURSE_BY_ID: (courseId: string) => `${API_BASE_URL}/courses/${courseId}`,
    CREATE_COURSE: `${API_BASE_URL}/courses`,
    UPDATE_COURSE: (courseId: string) => `${API_BASE_URL}/courses/${courseId}`,
    DELETE_COURSE: (courseId: string) => `${API_BASE_URL}/courses/${courseId}`,
    GET_CHAPTERS: (courseId: string) => `${API_BASE_URL}/chapters/course/${courseId}`,
    GET_LESSONS: (chapterId: string) => `${API_BASE_URL}/lessons/chapter/${chapterId}`,
  },

  // Enrollment Service
  ENROLLMENT: {
    GET_ALL_ENROLLMENTS: `${API_BASE_URL}/enrollments`,
    GET_ENROLLMENT_BY_ID: (enrollmentId: string) => `${API_BASE_URL}/enrollments/${enrollmentId}`,
    GET_STUDENT_ENROLLMENTS: (studentId: string) => `${API_BASE_URL}/enrollments/student/${studentId}`,
    GET_COURSE_ENROLLMENTS: (courseId: string) => `${API_BASE_URL}/enrollments/course/${courseId}`,
    ENROLL_STUDENT: `${API_BASE_URL}/enrollments`,
    UPDATE_ENROLLMENT_STATUS: (enrollmentId: string) => `${API_BASE_URL}/enrollments/${enrollmentId}/status`,
    DELETE_ENROLLMENT: (enrollmentId: string) => `${API_BASE_URL}/enrollments/${enrollmentId}`,
  },

  // Question Service
  QUESTION: {
    GET_ALL_QUESTIONS: `${API_BASE_URL}/questions/allQuestions`,
    GET_QUESTION_BY_ID: (questionId: string) => `${API_BASE_URL}/questions/${questionId}`,
    CREATE_QUESTION: `${API_BASE_URL}/questions`,
    UPDATE_QUESTION: (questionId: string) => `${API_BASE_URL}/questions/${questionId}`,
    DELETE_QUESTION: (questionId: string) => `${API_BASE_URL}/questions/${questionId}`,
    GET_BY_CATEGORY: (category: string) => `${API_BASE_URL}/questions/category/${category}`,
    GET_QUESTIONS_FOR_QUIZ: (quizId: string) => `${API_BASE_URL}/questions/quiz/${quizId}`,
  },

  // Quiz Service
  QUIZ: {
    GET_ALL_QUIZZES: `${API_BASE_URL}/quizzes`,
    GET_QUIZ_BY_ID: (quizId: string) => `${API_BASE_URL}/quizzes/get/${quizId}`,
    GET_QUIZ_QUESTIONS: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
    CREATE_QUIZ: `${API_BASE_URL}/quizzes`,
    UPDATE_QUIZ: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
    DELETE_QUIZ: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
    SUBMIT_QUIZ: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/submit`,
    GET_QUIZ_HISTORY: (studentId: string) => `${API_BASE_URL}/quizzes/history/${studentId}`,
    GET_QUIZ_ATTEMPT: (attemptId: string) => `${API_BASE_URL}/quizzes/attempt/${attemptId}`,
    GET_QUIZ_ATTEMPTS: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/attempts`,
  },

  // Admin Endpoints
  ADMIN: {
    GET_DASHBOARD_STATS: `${API_BASE_URL}/admin/stats`,
    GET_RECENT_USERS: `${API_BASE_URL}/admin/users/recent`,
  },

  // Notification Service
  NOTIFICATION: {
    GET_USER_NOTIFICATIONS: (userId: string) => `${API_BASE_URL}/notifications/user/${userId}`,
    GET_UNREAD_NOTIFICATIONS: (userId: string) => `${API_BASE_URL}/notifications/user/${userId}/unread`,
    GET_UNREAD_COUNT: (userId: string) => `${API_BASE_URL}/notifications/user/${userId}/unread/count`,
    MARK_AS_READ: (notificationId: string) => `${API_BASE_URL}/notifications/${notificationId}/read`,
    MARK_ALL_AS_READ: (userId: string) => `${API_BASE_URL}/notifications/user/${userId}/read-all`,
    DELETE_NOTIFICATION: (notificationId: string) => `${API_BASE_URL}/notifications/${notificationId}`,
    CREATE_NOTIFICATION: `${API_BASE_URL}/notifications`,
  },
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

/**
 * Request Headers
 */
export const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * API Request Helper
 * Generic function to make API requests
 */
export async function apiRequest<T>(
  url: string,
  method: string = HTTP_METHODS.GET,
  body?: any,
  includeAuth = true
): Promise<T> {
  try {
    const config: RequestInit = {
      method,
      headers: getHeaders(includeAuth),
    };

    if (body && method !== HTTP_METHODS.GET) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses or text responses (e.g., for DELETE operations)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return text as any;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Service-specific API functions
 */

// User Service Functions
export const userService = {
  login: (email: string, password: string) =>
    apiRequest(API_ENDPOINTS.USER.LOGIN, HTTP_METHODS.POST, { email, password }, false),
  
  register: (userData: { username: string; email: string; password: string; phone?: string }) =>
    apiRequest(API_ENDPOINTS.USER.REGISTER, HTTP_METHODS.POST, userData, false),
  
  getProfile: () =>
    apiRequest(API_ENDPOINTS.USER.PROFILE, HTTP_METHODS.GET),
  
  updateProfile: (profileData: { username?: string; phone?: string }) =>
    apiRequest(API_ENDPOINTS.USER.UPDATE_PROFILE, HTTP_METHODS.PUT, profileData),
  
  deleteAccount: () =>
    apiRequest(API_ENDPOINTS.USER.DELETE_ACCOUNT, HTTP_METHODS.DELETE),
  
  changePassword: (passwordData: { oldPassword: string; newPassword: string }) =>
    apiRequest(API_ENDPOINTS.USER.CHANGE_PASSWORD, HTTP_METHODS.POST, passwordData),

  // Admin functions
  adminGetAllUsers: () =>
    apiRequest(API_ENDPOINTS.USER.ADMIN_GET_ALL, HTTP_METHODS.GET),
  
  adminGetUserById: (id: number) =>
    apiRequest(API_ENDPOINTS.USER.ADMIN_GET_BY_ID(id), HTTP_METHODS.GET),
  
  adminDeleteUser: (id: number) =>
    apiRequest(API_ENDPOINTS.USER.ADMIN_DELETE(id), HTTP_METHODS.DELETE),
  
  adminActivateUser: (id: number) =>
    apiRequest(API_ENDPOINTS.USER.ADMIN_ACTIVATE(id), HTTP_METHODS.PUT),
  
  adminDeactivateUser: (id: number) =>
    apiRequest(API_ENDPOINTS.USER.ADMIN_DEACTIVATE(id), HTTP_METHODS.PUT),
};

// Course Service Functions
export const courseService = {
  getAllCourses: () =>
    apiRequest(API_ENDPOINTS.COURSE.GET_ALL_COURSES, HTTP_METHODS.GET),
  
  getCourseById: (courseId: string) =>
    apiRequest(API_ENDPOINTS.COURSE.GET_COURSE_BY_ID(courseId), HTTP_METHODS.GET),
  
  createCourse: (courseData: any) =>
    apiRequest(API_ENDPOINTS.COURSE.CREATE_COURSE, HTTP_METHODS.POST, courseData),
  
  updateCourse: (courseId: string, courseData: any) =>
    apiRequest(API_ENDPOINTS.COURSE.UPDATE_COURSE(courseId), HTTP_METHODS.PUT, courseData),
  
  deleteCourse: (courseId: string) =>
    apiRequest(API_ENDPOINTS.COURSE.DELETE_COURSE(courseId), HTTP_METHODS.DELETE),
};

// Enrollment Service Functions
export const enrollmentService = {
  getAllEnrollments: () =>
    apiRequest(API_ENDPOINTS.ENROLLMENT.GET_ALL_ENROLLMENTS, HTTP_METHODS.GET),
  
  getEnrollmentById: (enrollmentId: string) =>
    apiRequest(API_ENDPOINTS.ENROLLMENT.GET_ENROLLMENT_BY_ID(enrollmentId), HTTP_METHODS.GET),
  
  getStudentEnrollments: (studentId: string) =>
    apiRequest(API_ENDPOINTS.ENROLLMENT.GET_STUDENT_ENROLLMENTS(studentId), HTTP_METHODS.GET),
  
  getCourseEnrollments: (courseId: string) =>
    apiRequest(API_ENDPOINTS.ENROLLMENT.GET_COURSE_ENROLLMENTS(courseId), HTTP_METHODS.GET),
  
  checkEnrollment: (studentId: string, courseId: string) =>
    apiRequest(`${API_BASE_URL}/enrollments/check?studentId=${studentId}&courseId=${courseId}`, HTTP_METHODS.GET),
  
  enrollStudent: (studentId: string, courseId: string) =>
    apiRequest(`${API_ENDPOINTS.ENROLLMENT.ENROLL_STUDENT}?studentId=${studentId}&courseId=${courseId}`, HTTP_METHODS.POST),
  
  updateEnrollmentStatus: (enrollmentId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') =>
    apiRequest(`${API_ENDPOINTS.ENROLLMENT.UPDATE_ENROLLMENT_STATUS(enrollmentId)}?status=${status}`, HTTP_METHODS.PUT),
  
  updateProgress: (enrollmentId: string, progress: number, completedLessons: number = 0) =>
    apiRequest(`${API_BASE_URL}/enrollments/${enrollmentId}/progress?progress=${progress}&completedLessons=${completedLessons}`, HTTP_METHODS.PUT),
  
  updateProgressByStudentAndCourse: (studentId: string, courseId: string, progress: number, completedLessons: number = 0) =>
    apiRequest(`${API_BASE_URL}/enrollments/student/${studentId}/course/${courseId}/progress?progress=${progress}&completedLessons=${completedLessons}`, HTTP_METHODS.PUT),
  
  deleteEnrollment: (enrollmentId: string) =>
    apiRequest(API_ENDPOINTS.ENROLLMENT.DELETE_ENROLLMENT(enrollmentId), HTTP_METHODS.DELETE),
};

// Question Service Functions
export const questionService = {
  getAllQuestions: () =>
    apiRequest(API_ENDPOINTS.QUESTION.GET_ALL_QUESTIONS, HTTP_METHODS.GET),
  
  getQuestionById: (questionId: string) =>
    apiRequest(API_ENDPOINTS.QUESTION.GET_QUESTION_BY_ID(questionId), HTTP_METHODS.GET),
  
  createQuestion: (questionData: any) =>
    apiRequest(API_ENDPOINTS.QUESTION.CREATE_QUESTION, HTTP_METHODS.POST, questionData),
  
  updateQuestion: (questionId: string, questionData: any) =>
    apiRequest(API_ENDPOINTS.QUESTION.UPDATE_QUESTION(questionId), HTTP_METHODS.PUT, questionData),
  
  deleteQuestion: (questionId: string) =>
    apiRequest(API_ENDPOINTS.QUESTION.DELETE_QUESTION(questionId), HTTP_METHODS.DELETE),
  
  getQuestionsForQuiz: (quizId: string) =>
    apiRequest(API_ENDPOINTS.QUESTION.GET_QUESTIONS_FOR_QUIZ(quizId), HTTP_METHODS.GET),
};

// Quiz Service Functions
export const quizService = {
  getAllQuizzes: () =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_ALL_QUIZZES, HTTP_METHODS.GET),
  
  getQuizById: (quizId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_QUIZ_BY_ID(quizId), HTTP_METHODS.GET),
  
  getQuizWithQuestions: (quizId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_QUIZ_QUESTIONS(quizId), HTTP_METHODS.GET),
  
  createQuiz: (quizData: any) =>
    apiRequest(API_ENDPOINTS.QUIZ.CREATE_QUIZ, HTTP_METHODS.POST, quizData),
  
  updateQuiz: (quizId: string, quizData: any) =>
    apiRequest(API_ENDPOINTS.QUIZ.UPDATE_QUIZ(quizId), HTTP_METHODS.PUT, quizData),
  
  deleteQuiz: (quizId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.DELETE_QUIZ(quizId), HTTP_METHODS.DELETE),
  
  submitQuiz: (quizId: string, studentId: string, responses: any[], timeTaken: number) =>
    apiRequest(API_ENDPOINTS.QUIZ.SUBMIT_QUIZ(quizId), HTTP_METHODS.POST, { studentId, responses, timeTaken }),
  
  getQuizHistory: (studentId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_QUIZ_HISTORY(studentId), HTTP_METHODS.GET),
  
  getQuizAttempt: (attemptId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_QUIZ_ATTEMPT(attemptId), HTTP_METHODS.GET),
  
  getQuizAttempts: (quizId: string) =>
    apiRequest(API_ENDPOINTS.QUIZ.GET_QUIZ_ATTEMPTS(quizId), HTTP_METHODS.GET),
};

// Admin Service Functions
export const adminService = {
  getDashboardStats: () =>
    apiRequest(API_ENDPOINTS.ADMIN.GET_DASHBOARD_STATS, HTTP_METHODS.GET),
  
  getRecentUsers: () =>
    apiRequest(API_ENDPOINTS.ADMIN.GET_RECENT_USERS, HTTP_METHODS.GET),
};

// Notification Service Functions
export const notificationService = {
  getUserNotifications: (userId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.GET_USER_NOTIFICATIONS(userId), HTTP_METHODS.GET),
  
  getUnreadNotifications: (userId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.GET_UNREAD_NOTIFICATIONS(userId), HTTP_METHODS.GET),
  
  getUnreadCount: (userId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.GET_UNREAD_COUNT(userId), HTTP_METHODS.GET),
  
  markAsRead: (notificationId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(notificationId), HTTP_METHODS.PUT),
  
  markAllAsRead: (userId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.MARK_ALL_AS_READ(userId), HTTP_METHODS.PUT),
  
  deleteNotification: (notificationId: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.DELETE_NOTIFICATION(notificationId), HTTP_METHODS.DELETE),
  
  createNotification: (notificationData: any) =>
    apiRequest(API_ENDPOINTS.NOTIFICATION.CREATE_NOTIFICATION, HTTP_METHODS.POST, notificationData),
};

/**
 * Error Handler
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Example Usage:
 * 
 * // Login
 * const loginData = await userService.login('user@example.com', 'password123');
 * localStorage.setItem('authToken', loginData.token);
 * 
 * // Get all courses
 * const courses = await courseService.getAllCourses();
 * 
 * // Submit quiz
 * const result = await quizService.submitQuiz('quiz-id', { answers: [...] });
 * 
 * // Create question (admin)
 * const question = await questionService.createQuestion({
 *   questionText: 'What is...?',
 *   options: ['A', 'B', 'C', 'D'],
 *   correctAnswer: 0,
 *   category: 'Data Structure',
 *   difficulty: 'Medium'
 * });
 */

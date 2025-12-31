import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleBasedRedirect } from "./components/auth/RoleBasedRedirect";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { CoursesListPage } from "./components/courses/CoursesListPage";
import { CourseDetailPage } from "./components/courses/CourseDetailPage";
import { CourseLearningPage } from "./components/courses/CourseLearningPage";
import { MyCoursesPage } from "./components/courses/MyCoursesPage";
import { QuizListPage } from "./components/quizzes/QuizListPage";
import { QuizTakingPage } from "./components/quizzes/QuizTakingPage";
import { QuizResultsPage } from "./components/quizzes/QuizResultsPage";
import { QuizHistoryPage } from "./components/quizzes/QuizHistoryPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AnalyticsPage } from "./components/admin/AnalyticsPage";
import { QuestionsListPage } from "./components/admin/QuestionsListPage";
import { AddEditQuestionPage } from "./components/admin/AddEditQuestionPage";
import { UserManagementPage } from "./components/admin/UserManagementPage";
import { CourseManagementPage } from "./components/admin/CourseManagementPage";
import { AdminSettingsPage } from "./components/admin/AdminSettingsPage";
import { AdminQuizCreationPage } from "./components/admin/AdminQuizCreationPage";
import { AdminQuizzesPage } from "./components/admin/AdminQuizzesPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { EditProfilePage } from "./components/profile/EditProfilePage";
import { AchievementsPage } from "./components/achievements/AchievementsPage";
import { NotificationsPage } from "./components/notifications/NotificationsPage";
import { NotFoundPage } from "./components/errors/NotFoundPage";
import { ForbiddenPage } from "./components/errors/ForbiddenPage";
import { ServerErrorPage } from "./components/errors/ServerErrorPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<RoleBasedRedirect />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/courses" element={<CoursesListPage />} />
                      <Route path="/courses/:id" element={<CourseDetailPage />} />
                      <Route path="/courses/:id/learn" element={<CourseLearningPage />} />
                      <Route path="/my-courses" element={<MyCoursesPage />} />
                      <Route path="/quizzes" element={<QuizListPage />} />
                      <Route path="/quiz/:id/take" element={<QuizTakingPage />} />
                      <Route path="/quiz/:id/results/:attemptId" element={<QuizResultsPage />} />
                      <Route path="/quiz-history" element={<QuizHistoryPage />} />
                      <Route path="/achievements" element={<AchievementsPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/analytics" element={<AnalyticsPage />} />
                      <Route path="/admin/questions" element={<QuestionsListPage />} />
                      <Route path="/admin/questions/new" element={<AddEditQuestionPage />} />
                      <Route path="/admin/questions/:id/edit" element={<AddEditQuestionPage />} />
                      <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
                      <Route path="/admin/quiz/create" element={<AdminQuizCreationPage />} />
                      <Route path="/admin/quiz/:id/edit" element={<AdminQuizCreationPage />} />
                      <Route path="/admin/users" element={<UserManagementPage />} />
                      <Route path="/admin/courses" element={<CourseManagementPage />} />
                      <Route path="/admin/settings" element={<AdminSettingsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/edit" element={<EditProfilePage />} />
                      <Route path="/403" element={<ForbiddenPage />} />
                      <Route path="/500" element={<ServerErrorPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
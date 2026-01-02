import { Link } from "react-router-dom";
import { Home, Search, AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="size-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="size-16 text-[#1935CA]" />
          </div>
          <h1 className="text-6xl text-[#1935ca] mb-2">404</h1>
          <h2 className="text-gray-800 mb-4">Page Not Found</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            <Home className="size-5" />
            Go to Dashboard
          </Link>
          <Link
            to="/courses"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="size-5" />
            Browse Courses
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Need help finding something?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/courses" className="text-[#1935ca] hover:underline">
              Courses
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/quizzes" className="text-[#1935ca] hover:underline">
              Quizzes
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/my-courses" className="text-[#1935ca] hover:underline">
              My Courses
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/profile" className="text-[#1935ca] hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

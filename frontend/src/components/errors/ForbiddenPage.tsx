import { Link } from "react-router-dom";
import { Home, ShieldAlert, ArrowLeft } from "lucide-react";

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* 403 Icon */}
        <div className="mb-8">
          <div className="size-32 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="size-16 text-red-600" />
          </div>
          <h1 className="text-6xl text-red-600 mb-2">403</h1>
          <h2 className="text-gray-800 mb-4">Access Denied</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. This area is restricted to authorized users only.
        </p>

        {/* Reasons */}
        <div className="bg-white rounded-lg p-6 mb-8 text-left">
          <h3 className="text-gray-800 mb-3">This could be because:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>You don't have the required admin privileges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Your account doesn't have access to this resource</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>This feature requires a different user role</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            <Home className="size-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need access to this page?</p>
          <Link to="/contact" className="text-[#1935ca] hover:underline text-sm">
            Contact administrator
          </Link>
        </div>
      </div>
    </div>
  );
}

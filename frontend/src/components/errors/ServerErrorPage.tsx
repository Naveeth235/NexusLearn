import { Link } from "react-router-dom";
import { Home, RefreshCw, ServerCrash, AlertTriangle } from "lucide-react";

export function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* 500 Icon */}
        <div className="mb-8">
          <div className="size-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <ServerCrash className="size-16 text-orange-600" />
          </div>
          <h1 className="text-6xl text-orange-600 mb-2">500</h1>
          <h2 className="text-gray-800 mb-4">Server Error</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Oops! Something went wrong on our end. We're working to fix the issue. Please try again later.
        </p>

        {/* Error Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-orange-800 mb-1">What happened?</p>
              <p className="text-sm text-orange-700">
                Our servers encountered an unexpected error while processing your request. 
                Our team has been notified and is investigating the issue.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors"
          >
            <RefreshCw className="size-5" />
            Try Again
          </button>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="size-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">If the problem persists:</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/contact" className="text-[#1935ca] hover:underline">
              Report this issue to support
            </Link>
            <p className="text-gray-400">
              Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

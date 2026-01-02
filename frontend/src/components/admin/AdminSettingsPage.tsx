import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // General Settings
  const [platformName, setPlatformName] = useState("NexusLearn");
  const [supportEmail, setSupportEmail] = useState("support@nexuslearn.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [enrollmentAlerts, setEnrollmentAlerts] = useState(true);
  const [quizAlerts, setQuizAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Security Settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // Course Settings
  const [autoApproveEnrollments, setAutoApproveEnrollments] = useState(true);
  const [maxEnrollmentsPerUser, setMaxEnrollmentsPerUser] = useState("10");
  const [showCourseRatings, setShowCourseRatings] = useState(true);

  const sections: SettingSection[] = [
    { id: "general", title: "General", icon: <Settings className="size-5" /> },
    { id: "notifications", title: "Notifications", icon: <Bell className="size-5" /> },
    { id: "security", title: "Security", icon: <Shield className="size-5" /> },
    { id: "courses", title: "Courses", icon: <Database className="size-5" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Platform Settings</h1>
        <p className="text-gray-600">Configure your learning platform settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-[#1935CA] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* General Settings */}
          {activeSection === "general" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="size-5 text-[#1935ca]" />
                General Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-orange-800">Maintenance Mode</p>
                    <p className="text-sm text-orange-600">
                      When enabled, only admins can access the platform
                    </p>
                  </div>
                  <button
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      maintenanceMode ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${
                        maintenanceMode ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Mail className="size-5 text-[#1935ca]" />
                Notification Settings
              </h2>

              <div className="space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    description: "Send email notifications for important events",
                    checked: emailNotifications,
                    onChange: setEmailNotifications,
                  },
                  {
                    label: "Enrollment Alerts",
                    description: "Notify when new users enroll in courses",
                    checked: enrollmentAlerts,
                    onChange: setEnrollmentAlerts,
                  },
                  {
                    label: "Quiz Completion Alerts",
                    description: "Notify when users complete quizzes",
                    checked: quizAlerts,
                    onChange: setQuizAlerts,
                  },
                  {
                    label: "System Alerts",
                    description: "Receive alerts about system events and errors",
                    checked: systemAlerts,
                    onChange: setSystemAlerts,
                  },
                ].map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{setting.label}</p>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => setting.onChange(!setting.checked)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        setting.checked ? "bg-[#1935CA]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${
                          setting.checked ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="size-5 text-[#1935ca]" />
                Security Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Require Email Verification</p>
                    <p className="text-sm text-gray-600">
                      Users must verify their email before accessing courses
                    </p>
                  </div>
                  <button
                    onClick={() => setRequireEmailVerification(!requireEmailVerification)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      requireEmailVerification ? "bg-[#1935CA]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${
                        requireEmailVerification ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <select
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
                  >
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Account will be locked after max attempts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Course Settings */}
          {activeSection === "courses" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Database className="size-5 text-[#1935ca]" />
                Course Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Auto-Approve Enrollments</p>
                    <p className="text-sm text-gray-600">
                      Automatically approve course enrollment requests
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoApproveEnrollments(!autoApproveEnrollments)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoApproveEnrollments ? "bg-[#1935CA]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${
                        autoApproveEnrollments ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Enrollments Per User
                  </label>
                  <select
                    value={maxEnrollmentsPerUser}
                    onChange={(e) => setMaxEnrollmentsPerUser(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
                  >
                    <option value="5">5 courses</option>
                    <option value="10">10 courses</option>
                    <option value="20">20 courses</option>
                    <option value="0">Unlimited</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Show Course Ratings</p>
                    <p className="text-sm text-gray-600">
                      Display ratings and reviews on course pages
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCourseRatings(!showCourseRatings)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showCourseRatings ? "bg-[#1935CA]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${
                        showCourseRatings ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div>
              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="size-5" />
                  <span>Settings saved successfully</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="size-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#1935CA] text-white px-6 py-2 rounded-lg hover:bg-[#152a9e] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

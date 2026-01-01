import { useState, useEffect } from "react";
import {
  Bell,
  BookOpen,
  Trophy,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Trash2,
  Check,
  X,
  Loader2,
  Settings,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: string;
  type: "enrollment" | "achievement" | "quiz" | "system" | "message";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);

    // Simulate API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock notifications
    setNotifications([
      {
        id: "1",
        type: "enrollment",
        title: "Enrollment Approved",
        message: "Your enrollment in 'Introduction to Python' has been approved. Start learning now!",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        link: "/courses/1/learn",
      },
      {
        id: "2",
        type: "achievement",
        title: "Achievement Unlocked! 🎉",
        message: "Congratulations! You've earned the 'Quiz Taker' achievement.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        link: "/achievements",
      },
      {
        id: "3",
        type: "quiz",
        title: "Quiz Result Available",
        message: "You scored 85% on 'Data Structures Basics' quiz. Great job!",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        link: "/quiz-history",
      },
      {
        id: "4",
        type: "system",
        title: "New Course Available",
        message: "Check out our new course: 'Advanced Machine Learning with TensorFlow'",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        link: "/courses",
      },
      {
        id: "5",
        type: "message",
        title: "Course Update",
        message: "The instructor has added new content to 'Web Development Basics'",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        link: "/courses/2",
      },
    ]);

    setLoading(false);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "enrollment":
        return <BookOpen className="size-5 text-blue-500" />;
      case "achievement":
        return <Trophy className="size-5 text-yellow-500" />;
      case "quiz":
        return <CheckCircle className="size-5 text-green-500" />;
      case "system":
        return <AlertCircle className="size-5 text-purple-500" />;
      case "message":
        return <MessageCircle className="size-5 text-orange-500" />;
    }
  };

  const getNotificationBg = (type: Notification["type"]) => {
    switch (type) {
      case "enrollment":
        return "bg-blue-100";
      case "achievement":
        return "bg-yellow-100";
      case "quiz":
        return "bg-green-100";
      case "system":
        return "bg-purple-100";
      case "message":
        return "bg-orange-100";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1935ca] mb-2">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your learning progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#1935ca] hover:underline flex items-center gap-1"
            >
              <Check className="size-4" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 className="size-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#1935CA] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-[#1935CA] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                notification.read
                  ? "border-gray-100"
                  : "border-[#1935CA] bg-blue-50/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationBg(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className={`font-medium ${
                          notification.read ? "text-gray-700" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          notification.read ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-[#1935CA] rounded"
                          title="Mark as read"
                        >
                          <Check className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Delete"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Link */}
                  {notification.link && (
                    <Link
                      to={notification.link}
                      onClick={() => markAsRead(notification.id)}
                      className="inline-block mt-3 text-sm text-[#1935CA] hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Bell className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "You'll see notifications about your courses and achievements here"}
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings Link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          to="/profile/edit"
          className="text-sm text-gray-500 hover:text-[#1935CA] flex items-center gap-2"
        >
          <Settings className="size-4" />
          Manage notification preferences
        </Link>
      </div>
    </div>
  );
}

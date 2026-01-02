import { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2,
  Loader2,
  AlertCircle,
  CheckCheck,
  Award
} from "lucide-react";
import { notificationService } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: number;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [user, filter]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = filter === 'unread'
        ? await notificationService.getUnreadNotifications(user.id.toString()) as Notification[]
        : await notificationService.getUserNotifications(user.id.toString()) as Notification[];
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setProcessingId(notificationId);
      await notificationService.markAsRead(notificationId.toString());
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      setProcessingId(-1);
      await notificationService.markAllAsRead(user.id.toString());
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      setProcessingId(notificationId);
      await notificationService.deleteNotification(notificationId.toString());
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      console.error('Failed to delete notification:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ENROLLMENT_APPROVED':
        return <CheckCircle className="size-6 text-green-500" />;
      case 'ENROLLMENT_REJECTED':
        return <XCircle className="size-6 text-red-500" />;
      case 'QUIZ_RESULT':
        return <Award className="size-6 text-blue-500" />;
      default:
        return <Bell className="size-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="size-6 text-red-500" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={fetchNotifications}
            className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your learning activities</p>
      </div>

      {/* Filter and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-[#1935CA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-[#1935CA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={processingId === -1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1935CA] rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingId === -1 ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCheck className="size-4" />
              )}
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                notification.isRead
                  ? 'border-gray-100'
                  : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-gray-800 font-medium">{notification.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={processingId === notification.id}
                          className="text-[#1935CA] hover:text-blue-700 text-sm"
                          title="Mark as read"
                        >
                          {processingId === notification.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <CheckCircle className="size-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        disabled={processingId === notification.id}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete notification"
                      >
                        {processingId === notification.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="size-3" />
                    <span>{formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <Bell className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No notifications</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'unread'
              ? 'You have no unread notifications.'
              : 'You don\'t have any notifications yet.'}
          </p>
        </div>
      )}
    </div>
  );
}

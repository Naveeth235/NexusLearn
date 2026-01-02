import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  BookOpen,
  Loader2,
  AlertCircle,
  Filter
} from "lucide-react";
import { enrollmentService, courseService, userService } from "../../lib/api";

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl?: string;
}

interface Student {
  id: number;
  username: string;
  email: string;
}

interface Enrollment {
  id: number;
  studentId: string;
  student?: Student;
  course: Course;
  enrolledAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  progress: number;
}

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export function EnrollmentRequestsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('PENDING');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments() as Enrollment[];
      
      // Fetch student details for each enrollment
      const enrollmentsWithStudents = await Promise.all(
        data.map(async (enrollment) => {
          try {
            const student = await userService.adminGetUserById(parseInt(enrollment.studentId)) as Student;
            return { ...enrollment, student };
          } catch (err) {
            console.error(`Failed to fetch student ${enrollment.studentId}:`, err);
            return enrollment;
          }
        })
      );
      
      setEnrollments(enrollmentsWithStudents);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enrollments');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enrollmentId: number, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessingId(enrollmentId);
      await enrollmentService.updateEnrollmentStatus(enrollmentId.toString(), newStatus);
      
      // Update local state
      setEnrollments(prevEnrollments =>
        prevEnrollments.map(e =>
          e.id === enrollmentId ? { ...e, status: newStatus } : e
        )
      );
    } catch (err: any) {
      console.error('Failed to update enrollment status:', err);
      alert('Failed to update enrollment status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEnrollments = enrollments.filter(e => 
    filter === 'ALL' ? true : e.status === filter
  );

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'PENDING').length,
    approved: enrollments.filter(e => e.status === 'APPROVED').length,
    rejected: enrollments.filter(e => e.status === 'REJECTED').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[#1935ca]" />
          <span className="ml-2 text-gray-600">Loading enrollments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="size-6 text-red-500" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={fetchEnrollments}
            className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#1935ca] mb-2">Enrollment Requests</h1>
        <p className="text-gray-600">Manage student course enrollment requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="size-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
          <p className="text-3xl text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="size-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl text-gray-800">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="size-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-3xl text-gray-800">{stats.approved}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="size-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-3xl text-gray-800">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="size-5 text-gray-400" />
          <span className="text-sm text-gray-600">Filter:</span>
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filter === status
                    ? 'bg-[#1935CA] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Student Name</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Email</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Course</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Enrolled At</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-gray-400" />
                        <span className="text-gray-800">
                          {enrollment.student?.username || `Student ${enrollment.studentId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {enrollment.student?.email || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-800 font-medium">{enrollment.course.title}</p>
                        <p className="text-sm text-gray-500">{enrollment.course.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatDate(enrollment.enrolledAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {enrollment.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(enrollment.id, 'APPROVED')}
                            disabled={processingId === enrollment.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {processingId === enrollment.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <CheckCircle className="size-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(enrollment.id, 'REJECTED')}
                            disabled={processingId === enrollment.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {processingId === enrollment.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <XCircle className="size-4" />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No enrollments found</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'PENDING' 
              ? 'There are no pending enrollment requests at the moment.'
              : `No ${filter.toLowerCase()} enrollments to display.`}
          </p>
        </div>
      )}
    </div>
  );
}

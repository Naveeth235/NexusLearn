import { useState, useEffect } from "react";
import { Search, Trash2, Ban, CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw, UserCheck } from "lucide-react";
import { userService } from "../../lib/api";

interface UserData {
  id?: number;
  username: string;
  email: string;
  phone?: string;
  active: boolean;
  roles: string[];
}

export function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToToggle, setUserToToggle] = useState<{ id: number; active: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const usersPerPage = 10;

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.adminGetAllUsers() as UserData[];
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleDisplay = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "Admin";
    if (roles.includes("STUDENT")) return "Student";
    return roles[0] || "User";
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(true);
      await userService.adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setUserToDelete(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentlyActive: boolean) => {
    try {
      setActionLoading(true);
      if (currentlyActive) {
        await userService.adminDeactivateUser(id);
      } else {
        await userService.adminActivateUser(id);
      }
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, active: !currentlyActive } : u
      ));
      setUserToToggle(null);
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="size-8 text-[#1935CA] animate-spin" />
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[#1935ca] mb-2">User Management</h1>
          <p className="text-gray-600">Manage platform users and permissions</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent"
          />
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Username</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Email</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Phone</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Role</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-800">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{user.phone || "-"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    user.roles.includes("ADMIN") 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {getRoleDisplay(user.roles)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.active ? (
                      <CheckCircle className="size-4 text-green-600" />
                    ) : (
                      <XCircle className="size-4 text-red-600" />
                    )}
                    <span className={`text-sm ${
                      user.active ? "text-green-700" : "text-red-700"
                    }`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {user.active ? (
                      <button
                        onClick={() => user.id && setUserToToggle({ id: user.id, active: true })}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Deactivate"
                      >
                        <Ban className="size-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => user.id && setUserToToggle({ id: user.id, active: false })}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate"
                      >
                        <UserCheck className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => user.id && setUserToDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4 mb-8">
        {currentUsers.map((user) => (
          <div key={user.email} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm px-3 py-1 rounded-full ${
                  user.roles.includes("ADMIN") 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {getRoleDisplay(user.roles)}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center gap-1">
                  {user.active ? (
                    <CheckCircle className="size-4 text-green-600" />
                  ) : (
                    <XCircle className="size-4 text-red-600" />
                  )}
                  <span className={user.active ? "text-green-700" : "text-red-700"}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-800">{user.phone || "-"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {user.active ? (
                <button 
                  onClick={() => user.id && setUserToToggle({ id: user.id, active: true })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Ban className="size-4" />
                  Deactivate
                </button>
              ) : (
                <button 
                  onClick={() => user.id && setUserToToggle({ id: user.id, active: false })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <UserCheck className="size-4" />
                  Activate
                </button>
              )}
              <button 
                onClick={() => user.id && setUserToDelete(user.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Search className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-[#1935CA] text-white"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-gray-800 mb-4">Delete User?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone and will remove all user data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userToDelete)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <RefreshCw className="size-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {userToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-gray-800 mb-4">
              {userToToggle.active ? "Deactivate" : "Activate"} User?
            </h3>
            <p className="text-gray-600 mb-6">
              {userToToggle.active
                ? "Are you sure you want to deactivate this user? They will not be able to access the platform until reactivated."
                : "Are you sure you want to activate this user? They will be able to access the platform again."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToToggle(null)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(userToToggle.id, userToToggle.active)}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  userToToggle.active 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionLoading && <RefreshCw className="size-4 animate-spin" />}
                {userToToggle.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

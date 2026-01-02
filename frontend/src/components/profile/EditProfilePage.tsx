import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Camera, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../lib/api";

export function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: "",
        avatar: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Image size should be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation (only if user is trying to change password)
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Update basic profile info
      await userService.updateProfile({
        username: formData.username
      });

      // Change password if provided
      if (formData.newPassword) {
        await userService.changePassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrors({
        submit: error.message || "Failed to update profile"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-[#1935ca] hover:underline mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Link>
        <h1 className="text-[#1935ca] mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your profile information and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Avatar Upload - Disabled for now */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-800 mb-4">Profile Picture</h3>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-24 bg-gradient-to-br from-[#1935CA] to-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
                {formData.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Profile picture upload coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-800 mb-4">Basic Information</h3>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                  errors.username ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-800 mb-4">Change Password</h3>
          <p className="text-sm text-gray-600 mb-4">
            Leave blank if you don't want to change your password
          </p>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                  errors.currentPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1935CA] focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="size-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#1935CA] text-white rounded-lg hover:bg-[#152a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </form>
    </div>
  );
}

import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  LogOut,
  Search,
  Library,
  Brain,
  User,
  Settings,
  Users,
  FileQuestion,
  BarChart3,
  UserCheck
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NexusLogo from "../assets/Nexus_Logo.png";

function CyberLogo() {
  return (
    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
      <img src={NexusLogo} alt="NexusLearn" className="h-10 w-auto" />
    </div>
  );
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isStudent, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200/80 p-6 flex flex-col min-h-screen">
      <CyberLogo />
      
      <div className="relative mb-6 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-[#1935CA] transition-colors" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1935CA]/20 focus:border-[#1935CA] focus:bg-white transition-all"
        />
      </div>

      <nav className="flex-1 space-y-1">
        {/* Admin Dashboard */}
        {isAdmin ? (
          <>
            <SidebarItem 
              to="/admin/dashboard" 
              icon={<LayoutDashboard className="size-5" />} 
              label="Dashboard" 
              active={location.pathname === "/admin/dashboard"}
            />
            <SidebarItem 
              to="/admin/courses" 
              icon={<BookOpen className="size-5" />} 
              label="Manage Courses" 
              active={location.pathname === "/admin/courses"}
            />
            <SidebarItem 
              to="/admin/enrollments" 
              icon={<UserCheck className="size-5" />} 
              label="Enrollment Requests" 
              active={location.pathname === "/admin/enrollments"}
            />
            <SidebarItem 
              to="/admin/users" 
              icon={<Users className="size-5" />} 
              label="Manage Users" 
              active={location.pathname === "/admin/users"}
            />
            <SidebarItem 
              to="/admin/questions" 
              icon={<FileQuestion className="size-5" />} 
              label="Manage Questions" 
              active={location.pathname === "/admin/questions"}
            />
            <SidebarItem 
              to="/admin/quizzes" 
              icon={<Brain className="size-5" />} 
              label="Manage Quizzes" 
              active={location.pathname === "/admin/quizzes"}
            />
            <SidebarItem 
              to="/admin/analytics" 
              icon={<BarChart3 className="size-5" />} 
              label="Analytics" 
              active={location.pathname === "/admin/analytics"}
            />
          </>
        ) : (
          <>
            {/* Student Dashboard */}
            <SidebarItem 
              to="/dashboard" 
              icon={<LayoutDashboard className="size-5" />} 
              label="Dashboard" 
              active={location.pathname === "/dashboard"}
            />
            <SidebarItem 
              to="/courses" 
              icon={<BookOpen className="size-5" />} 
              label="All Courses" 
              active={location.pathname === "/courses"}
            />
            <SidebarItem 
              to="/my-courses" 
              icon={<Library className="size-5" />} 
              label="My Courses" 
              active={location.pathname === "/my-courses"}
            />
            <SidebarItem 
              to="/quizzes" 
              icon={<Brain className="size-5" />} 
              label="Quizzes" 
              active={location.pathname === "/quizzes"}
            />
            <SidebarItem 
              to="/quiz-history" 
              icon={<History className="size-5" />} 
              label="Quiz History" 
              active={location.pathname === "/quiz-history"}
            />
          </>
        )}
        
        {/* Notifications temporarily disabled */}
        {/*
        {!isAdmin && (
          <SidebarItem 
            to="/notifications" 
            icon={<Bell className="size-5" />} 
            label="Notifications" 
            active={location.pathname === "/notifications"}
          />
        )}
        */}
        
        <div className="pt-2 mt-2 border-t border-gray-100">
          <SidebarItem 
            to="/profile" 
            icon={<User className="size-5" />} 
            label="Profile" 
            active={location.pathname === "/profile" || location.pathname === "/profile/edit"}
          />
          {isAdmin && (
            <SidebarItem 
              to="/admin/settings" 
              icon={<Settings className="size-5" />} 
              label="Settings" 
              active={location.pathname === "/admin/settings"}
            />
          )}
        </div>
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-red-600 hover:bg-red-50 rounded-lg px-3 py-2.5 transition-all group"
        >
          <LogOut className="size-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, active = false, badge }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 transition-all font-medium ${ 
        active 
          ? "bg-gradient-to-r from-[#1935CA] to-blue-600 text-white shadow-lg shadow-blue-200/50" 
          : "text-gray-700 hover:bg-gray-50 hover:text-[#1935CA]"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="size-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}
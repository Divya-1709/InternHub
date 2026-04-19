import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  FolderOpen, 
  ClipboardCheck, 
  Calendar, 
  Settings, 
  User, 
  LogOut,
  Building2,
  Users2,
  PlusSquare,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from './ui/Button';

const Sidebar = ({ role, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/smart-match', label: 'Smart Match', icon: Target },
          { to: '/my-application', label: 'My Applications', icon: FolderOpen },
          { to: '/tasks', label: 'Tasks', icon: ClipboardCheck },
          { to: '/student/interviews', label: 'Interviews', icon: Calendar },
        ];
      case 'company':
        return [
          { to: '/company', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/company/applicants', label: 'Applicants', icon: Users2 },
          { to: '/company/internships', label: 'My Internships', icon: Building2 },
          { to: '/company/post', label: 'Post Internship', icon: PlusSquare },
          { to: '/company/payouts', label: 'Payouts', icon: CreditCard },
          { to: '/company/interviews', label: 'Interviews', icon: Calendar },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          // Add admin items if needed
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="fixed left-0 top-0 h-screen bg-[var(--nav-bg)] text-[var(--text-muted)] border-r border-[var(--nav-border)] z-50 flex flex-col transition-colors duration-300"
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--nav-border)]">
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--text-primary)] font-bold text-xl tracking-tight"
          >
            InternHub
          </motion.span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isDashboard = item.to === '/student' || item.to === '/company' || item.to === '/admin';
          const isActive = isDashboard 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive 
                  ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-sm' 
                  : 'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              )}
            >
              <item.icon size={20} className={cn(isActive ? 'text-[var(--text-inverse)]' : 'group-hover:text-[var(--text-primary)] transition-colors')} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-[var(--border-color)]">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Items */}
      <div className="p-3 border-t border-[var(--nav-border)] space-y-1">
        <Link
          to="/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all group relative',
            location.pathname === '/profile' && 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-sm'
          )}
        >
          <User size={20} className={cn(location.pathname === '/profile' ? 'text-[var(--text-inverse)]' : '')} />
          {!isCollapsed && <span className="font-medium text-sm">Profile</span>}
        </Link>
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all group relative',
            location.pathname === '/settings' && 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-sm'
          )}
        >
          <Settings size={20} className={cn(location.pathname === '/settings' ? 'text-[var(--text-inverse)]' : '')} />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all group relative"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

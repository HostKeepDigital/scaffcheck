import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { HardHat, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export default function AppHeader({ showNav = true }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-700/50"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-lg">
          <HardHat className="w-5 h-5 text-amber-400" />
          ScaffCheck
        </Link>

        {showNav && (
          <nav className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={handleLogout}>
                  <LogOut className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  onClick={() => navigate('/register')}>
                  Start free trial
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
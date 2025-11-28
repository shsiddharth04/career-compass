import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, LogOut, User as UserIcon, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThreadsBackground } from './ThreadsBackground';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Consistent Dark Theme Navigation Classes with enhanced glassmorphism
  const navClasses = "fixed w-full z-50 top-0 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-neutral-950/60";
  const activeLinkClasses = "bg-white/10 text-white";
  const inactiveLinkClasses = "text-slate-400 hover:bg-white/5 hover:text-white";

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-slate-200 relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Global Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
        <ThreadsBackground color="#ffffff" />
        {/* Subtle radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 pointer-events-none"></div>
      </div>

      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <Compass className="h-8 w-8 text-white group-hover:text-blue-400 transition-colors" />
                <span className="text-xl font-bold tracking-tight text-white transition-opacity duration-300">
                  CareerCompass
                </span>
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-4 items-center">
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${isActive('/dashboard') ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/explore"
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${isActive('/explore') ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                      Explore
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-300">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="hidden lg:block">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-white/10 text-sm leading-4 font-medium rounded-full text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-neutral-900"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors px-4 py-2">Log in</Link>
                  <Link to="/signup" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-full text-neutral-950 bg-white hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    Sign up
                  </Link>
                </>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute w-full z-50 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10">
            <div className="pt-2 pb-3 space-y-1 px-2">
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}
                  >
                    <div className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                    </div>
                  </Link>
                  <Link
                    to="/explore"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${isActive('/explore') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}
                  >
                     <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Explore Public Plans
                    </div>
                  </Link>
                </>
              )}
            </div>
            <div className="pt-4 pb-4 border-t border-white/10">
              {user ? (
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-8 w-8 rounded-full p-1 bg-white/10 text-slate-300" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm font-medium text-slate-400">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="ml-auto flex-shrink-0 p-1 rounded-full bg-transparent text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3 px-4 pb-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg border border-white/5"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-base font-bold text-neutral-950 bg-white hover:bg-slate-200 px-4 py-2.5 rounded-lg shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 w-full relative z-10 pt-20">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-neutral-950/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-slate-400" />
              <span className="text-slate-400 font-medium text-lg">CareerCompass</span>
            </div>
            <p className="text-sm text-slate-600">&copy; 2024 CareerCompass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
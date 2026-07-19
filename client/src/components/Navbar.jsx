import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  Sun, Moon, Menu, X, Bell, User, LogOut, LayoutDashboard, 
  PenSquare, Settings, Search, BookOpen, Layers
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // User profile dropdown state
  const [notifOpen, setNotifOpen] = useState(false); // Notification dropdown state
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch notifications if user logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Click outside handlers to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/users/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err.message);
    }
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      try {
        const res = await api.get(`/blogs?search=${val}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.blogs);
        }
      } catch (err) {
        console.error('Suggestions error:', err.message);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${searchQuery}`);
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-gradient-sunset font-display">
              <BookOpen className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              <span>InkFlow</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors">Home</Link>
            <Link to="/blogs" className="text-sm font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors">Blogs</Link>
            <Link to="/categories" className="text-sm font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors">Categories</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors">Contact</Link>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden lg:block relative max-w-xs w-full">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-1.5 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-900 dark:text-slate-100 transition-all duration-300"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </form>
            
            {/* Live Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                {suggestions.map((blog) => (
                  <button
                    key={blog._id}
                    onClick={() => {
                      navigate(`/blog/${blog.slug}`);
                      setSuggestions([]);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex flex-col"
                  >
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{blog.title}</span>
                    <span className="text-xs text-slate-400">{blog.category?.name} • {blog.readTime} min read</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                {/* Notifications Bell */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      if (!notifOpen && unreadCount > 0) markAllRead();
                    }}
                    className="relative p-2 text-slate-600 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600"></span>
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                        <span className="text-xs text-slate-400">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.map((notif) => (
                            <Link
                              key={notif._id}
                              to={notif.blog ? `/blog/${notif.blog.slug}` : '#'}
                              onClick={() => setNotifOpen(false)}
                              className={`block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-violet-50/20 dark:bg-violet-950/10' : ''}`}
                            >
                              <div className="flex space-x-3">
                                <img src={notif.sender?.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'} alt="" className="h-8 w-8 rounded-full border border-slate-100 dark:border-slate-800" />
                                <div>
                                  <p className="text-xs text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{notif.sender?.name}</span>{' '}
                                    {notif.type === 'like' && 'liked your article'}
                                    {notif.type === 'comment' && 'commented on your article'}
                                    {notif.type === 'reply' && 'replied to your comment'}
                                  </p>
                                  {notif.blog && (
                                    <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium truncate max-w-[200px] mt-0.5">"{notif.blog.title}"</p>
                                  )}
                                  <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1.5 focus:outline-none"
                  >
                    <img
                      src={user.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-violet-500/20 hover:border-violet-500 object-cover transition-colors"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                      </div>
                      
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link to="/create-blog" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        <PenSquare className="h-4 w-4" />
                        <span>Write Blog</span>
                      </Link>

                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/20 font-medium transition-colors">
                          <Settings className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 border-t border-slate-100 dark:border-slate-800 mt-1 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-full shadow-lg hover:shadow-violet-500/20 transition-all duration-300">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 rounded-full transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200/50 dark:border-slate-800/50 px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          {/* Links */}
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Home</Link>
          <Link to="/blogs" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Blogs</Link>
          <Link to="/categories" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Categories</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Contact</Link>
          
          {!user && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Sign In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-lg transition-all">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

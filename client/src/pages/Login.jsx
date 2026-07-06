import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect target after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/70">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage your blogs and engage with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 transition-all text-sm"
                  required
                />
                <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 transition-all text-sm"
                  required
                />
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400" onClick={(e) => { e.preventDefault(); toast.info("Password recovery is currently set to email templates."); }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch Link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 hover:underline">
              Get Started
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-9xl font-black text-violet-600 dark:text-violet-400 font-display tracking-widest">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white">
          Page Not Found
        </h2>
      </motion.div>
      <p className="text-slate-550 dark:text-slate-400 max-w-md leading-relaxed text-sm">
        Oops! The page you are looking for does not exist, has been removed, or was renamed. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
        >
          <Home className="h-4.5 w-4.5" />
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

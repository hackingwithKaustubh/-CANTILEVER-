import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Github, Twitter, Linkedin, Youtube, Send, 
  BookOpen, Mail, Phone, MapPin 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setLoading(false);
    }, 1200);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950/90 border-t border-slate-800 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-white font-display">
              <BookOpen className="h-7 w-7 text-violet-500" />
              <span>InkFlow</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              InkFlow is a premium blogging platform where developers, creators, and technologists share insights, write guides, and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-violet-600 rounded-full transition-all duration-300"><Github className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-violet-600 rounded-full transition-all duration-300"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-violet-600 rounded-full transition-all duration-300"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-violet-600 rounded-full transition-all duration-300"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 font-display">Navigation</h3>
            <ul className="space-y-3.5 text-sm">
              <li><Link to="/" className="hover:text-white hover:underline transition-all">Home</Link></li>
              <li><Link to="/blogs" className="hover:text-white hover:underline transition-all">All Blogs</Link></li>
              <li><Link to="/categories" className="hover:text-white hover:underline transition-all">Categories</Link></li>
              <li><Link to="/login" className="hover:text-white hover:underline transition-all">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white hover:underline transition-all">Register</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 font-display">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-violet-500" />
                <a href="mailto:support@inkflow.io" className="hover:text-white transition-colors">support@inkflow.io</a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-violet-500" />
                <a href="tel:+91-11-4567-8900" className="hover:text-white transition-colors">+91-11-4567-8900</a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-violet-500" />
                <span>Bangalore, India</span>
              </li>
              <li>
                <Link to="/contact" className="text-violet-400 hover:text-violet-300 transition-colors text-xs font-semibold">→ Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-display">Stay Updated</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to our newsletter to receive the latest articles, guides, and tutorials.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} InkFlow. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

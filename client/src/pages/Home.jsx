import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, TrendingUp, Sparkles, 
  Users, BookOpen, Eye, Award, MessageSquare 
} from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latestRes, trendingRes, categoriesRes] = await Promise.all([
          api.get('/blogs?limit=6'),
          api.get('/blogs/trending'),
          api.get('/categories')
        ]);
        
        if (latestRes.data.success) setBlogs(latestRes.data.blogs);
        if (trendingRes.data.success) setTrending(trendingRes.data.blogs);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.categories);
      } catch (err) {
        console.error('Error fetching landing data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/blogs?search=${searchVal}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/50 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-transparent py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-full text-xs font-semibold border border-violet-200/40"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover the Art of Writing</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight dark:text-white font-display max-w-4xl mx-auto leading-tight"
          >
            Stay curious. Read and share{' '}
            <span className="text-gradient-sunset">InkFlow</span> stories.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Explore technical guides, software methodologies, daily thoughts, and lifestyle diaries written by creators around the world.
          </motion.p>

          {/* Search bar inside Hero */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white dark:bg-slate-900 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-lg focus-within:ring-4 focus-within:ring-violet-500/10 transition-all p-1.5">
              <div className="relative flex-1 pl-4">
                <input
                  type="text"
                  placeholder="Search topic, title, tags, or authors..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-transparent focus:outline-none dark:text-slate-100 text-sm py-2"
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-md hover:shadow-violet-500/20"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm text-center">
          <div className="space-y-1">
            <div className="inline-flex p-3 bg-violet-50 dark:bg-slate-800 rounded-2xl text-violet-600 dark:text-violet-400 mb-2">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-3xl font-extrabold dark:text-white font-display">10,000+</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Active Writers</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex p-3 bg-violet-50 dark:bg-slate-800 rounded-2xl text-violet-600 dark:text-violet-400 mb-2">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="text-3xl font-extrabold dark:text-white font-display">30,000+</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Published Blogs</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex p-3 bg-violet-50 dark:bg-slate-800 rounded-2xl text-violet-600 dark:text-violet-400 mb-2">
              <Eye className="h-6 w-6" />
            </div>
            <p className="text-3xl font-extrabold dark:text-white font-display">1.2M+</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Monthly Views</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex p-3 bg-violet-50 dark:bg-slate-800 rounded-2xl text-violet-600 dark:text-violet-400 mb-2">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-3xl font-extrabold dark:text-white font-display">4.9/5</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Author Rating</p>
          </div>
        </div>
      </section>

      {/* 3. Trending Articles */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-2xl font-bold dark:text-white font-display">Trending on InkFlow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.slice(0, 3).map((blog, idx) => (
              <div key={blog._id} className="flex space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all">
                <span className="text-4xl font-extrabold text-slate-200 dark:text-slate-800 font-display">0{idx + 1}</span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <img src={blog.author?.profilePicture} alt="" className="h-5 w-5 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">@{blog.author?.username}</span>
                  </div>
                  <Link to={`/blog/${blog.slug}`} className="block">
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-display leading-snug">{blog.title}</h3>
                  </Link>
                  <p className="text-[11px] text-slate-400">{new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime} min read</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Explore Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold dark:text-white font-display">Explore Categories</h2>
            <p className="text-sm text-slate-400">Discover articles grouped by topic and domains</p>
          </div>
          <Link to="/categories" className="flex items-center space-x-1 text-sm font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              to={`/blogs?category=${cat.slug}`}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:border-violet-500 hover:shadow-lg transition-all"
            >
              <div className="h-10 w-10 rounded-xl overflow-hidden mb-3.5 shadow-sm">
                <img src={cat.image} alt="" className="h-full w-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-slate-550 line-clamp-1">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Latest Posts Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold dark:text-white font-display">Latest Articles</h2>
            <p className="text-sm text-slate-400">Catch up on the latest published posts from our creators</p>
          </div>
          <Link to="/blogs" className="flex items-center space-x-1 text-sm font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400">
            <span>Explore All Posts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <BlogCardSkeleton key={idx} />)
            : blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white font-display">Loved by Readers Globally</h2>
          <p className="text-sm text-slate-400">Here is what developers and writers think about our platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "The design is incredibly premium, and writing feels like writing on Medium but with an extremely optimized layout. The dark mode is beautiful."
            </p>
            <div className="flex items-center space-x-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=sarah" alt="" className="h-9 w-9 rounded-full" />
              <div>
                <h4 className="text-sm font-bold dark:text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-slate-400">Frontend Developer</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "The custom content editor makes drafting posts effortless, and the admin analytics panels give me exact insights into how my tech posts are performing."
            </p>
            <div className="flex items-center space-x-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=alex" alt="" className="h-9 w-9 rounded-full" />
              <div>
                <h4 className="text-sm font-bold dark:text-white">Alex Rivera</h4>
                <p className="text-[10px] text-slate-400">Cloud Engineer</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "I love the structured tags and categoric navigation. It makes finding specific programming tips fast, and the mobile performance is stellar."
            </p>
            <div className="flex items-center space-x-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=marcus" alt="" className="h-9 w-9 rounded-full" />
              <div>
                <h4 className="text-sm font-bold dark:text-white">Marcus Vance</h4>
                <p className="text-[10px] text-slate-400">Tech Entrepreneur</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

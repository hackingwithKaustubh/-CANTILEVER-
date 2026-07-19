import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Smartphone, Globe, MapPin, Calendar, Heart, MessageSquare, Eye } from 'lucide-react';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const AuthorProfile = () => {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBlogs: 0, totalLikes: 0, totalViews: 0, totalComments: 0 });

  useEffect(() => {
    fetchAuthorProfile();
  }, [username]);

  const fetchAuthorProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/profile/${username}`);
      if (res.data.success) {
        setAuthor(res.data.user);
        
        // Fetch author's blogs
        const blogsRes = await api.get(`/blogs?author=${res.data.user._id}&limit=100`);
        if (blogsRes.data.success) {
          setBlogs(blogsRes.data.blogs);
          
          // Calculate stats
          const totalLikes = blogsRes.data.blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
          const totalViews = blogsRes.data.blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
          const totalComments = blogsRes.data.blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
          
          setStats({
            totalBlogs: blogsRes.data.blogs.length,
            totalLikes,
            totalViews,
            totalComments
          });
        }
      }
    } catch (err) {
      console.error('Error fetching author profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Author not found</h2>
          <Link to="/blogs" className="text-violet-600 hover:text-violet-700 font-semibold">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Author Header */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={author.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                alt={author.name}
                className="h-32 w-32 rounded-2xl object-cover border-4 border-violet-200 dark:border-violet-800 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {stats.totalBlogs}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{author.name}</h1>
              <p className="text-violet-600 dark:text-violet-400 font-semibold mb-3">@{author.username}</p>
              
              {author.bio && (
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4 max-w-2xl">
                  {author.bio}
                </p>
              )}

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {author.location && (
                  <span className="inline-flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-violet-600" />
                    <span>{author.location}</span>
                  </span>
                )}
                {author.email && (
                  <a href={`mailto:${author.email}`} className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                    <Mail className="h-4 w-4" />
                    <span>{author.email}</span>
                  </a>
                )}
                {author.phone && (
                  <a href={`tel:${author.phone}`} className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                    <Smartphone className="h-4 w-4" />
                    <span>{author.phone}</span>
                  </a>
                )}
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.totalBlogs}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Articles</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.totalLikes}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Likes</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalViews}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Views</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalComments}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Discussions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">All Articles by {author.name}</h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">No articles published yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-6">
                  {/* Blog Image */}
                  {blog.coverImage && (
                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Blog Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 text-xs font-bold rounded-full">
                        {blog.category?.name}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    {blog.subtitle && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {blog.subtitle}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span>{blog.readTime} min read</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {blog.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {blog.comments?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center justify-end">
                    <div className="p-2 bg-violet-50 dark:bg-violet-950/20 rounded-lg group-hover:bg-violet-100 dark:group-hover:bg-violet-950/40 transition-colors">
                      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AuthorProfile;

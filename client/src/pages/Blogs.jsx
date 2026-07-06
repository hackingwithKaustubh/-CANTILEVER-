import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/SkeletonLoader';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  // URL Query Parameters
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Build url based on active filters
        let url = `/blogs?page=${page}&limit=9`;
        if (category) url += `&category=${category}`;
        if (tag) url += `&tag=${tag}`;
        if (search) url += `&search=${search}`;

        const res = await api.get(url);
        if (res.data.success) {
          setBlogs(res.data.blogs);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error loading blogs list:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category, search, tag, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, category, tag, page: '1' });
  };

  const handleCategoryClick = (catSlug) => {
    const nextCat = category === catSlug ? '' : catSlug;
    setSearchParams({ search, category: nextCat, tag, page: '1' });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ search, category, tag, page: newPage.toString() });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white font-display">
            Explore Articles
          </h1>
          <p className="text-sm text-slate-400">
            {tag ? `Showing posts tagged #${tag}` : category ? `Showing posts in Category: ${category}` : 'Browse through all publications'}
          </p>
        </div>

        {/* In-page Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search within blogs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 transition-all text-sm shadow-sm"
          />
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
        </form>
      </div>

      {/* Grid Layout (Categories Sidebar + Blogs Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-slate-100">
            <SlidersHorizontal className="h-4.5 w-4.5 text-violet-500" />
            <span className="text-sm uppercase tracking-wider">Filters</span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold dark:text-slate-200">Categories</h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => setSearchParams({ search, tag, page: '1' })}
                className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!category ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${category === cat.slug ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blogs Container */}
        <div className="lg:col-span-3 space-y-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">No posts found</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto">Try widening your search keywords or resetting your active category query.</p>
              <button onClick={() => setSearchParams({})} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition mt-2">Reset Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CategoryCardSkeleton } from '../components/SkeletonLoader';
import { FolderOpen, ArrowRight } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories page:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white font-display">Categories</h1>
        <p className="text-sm text-slate-400">Discover articles grouped by topic areas and developer ecosystems</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-12 w-16 overflow-hidden rounded-xl shadow-sm">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-550" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 font-display">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-450 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {cat.description || 'Discover stories, tutorials, and guides published under this category.'}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/blogs?category=${cat.slug}`}
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-violet-650 hover:text-violet-550 dark:text-violet-400 dark:hover:text-violet-300 group/btn"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

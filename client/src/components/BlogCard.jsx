import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  
  const {
    title,
    subtitle,
    slug,
    coverImage,
    author,
    category,
    tags = [],
    readTime = 1,
    likes = [],
    createdAt
  } = blog;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Cover Image */}
      <Link to={`/blog/${slug}`} className="relative block overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-slate-900/90 text-violet-600 dark:text-violet-400 backdrop-blur-sm border border-slate-200/10 shadow-sm">
            {category.name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Author & Date */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={author?.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
            alt={author?.name}
            className="h-8 w-8 rounded-full object-cover border border-slate-100 dark:border-slate-800"
          />
          <div className="text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {author?.name || 'Anonymous'}
            </p>
            <p className="text-slate-400 dark:text-slate-500">{formattedDate}</p>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex-1">
          <Link to={`/blog/${slug}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-2 transition-colors font-display mb-2">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {subtitle || 'Click to read this article\'s content and discover more insights.'}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.slice(0, 3).map((tag, i) => (
              <Link
                key={i}
                to={`/blogs?tag=${tag}`}
                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-violet-50 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Footer Metrics */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500/10" />
              <span>{likes.length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{readTime} min</span>
            </span>
          </div>

          <Link
            to={`/blog/${slug}`}
            className="flex items-center space-x-1 text-violet-600 dark:text-violet-400 font-semibold group/btn"
          >
            <span>Read More</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

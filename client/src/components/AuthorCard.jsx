import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Smartphone, Globe, MapPin } from 'lucide-react';

const AuthorCard = ({ author }) => {
  if (!author) return null;

  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-violet-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-violet-200/30 dark:border-slate-700/30">
        <img
          src={author.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
          alt={author.name}
          className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
        />
        <div className="flex-1">
          <Link to={`/author/${author.username}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            {author.name}
          </Link>
          <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold">@{author.username}</p>
          {author.location && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{author.location}</span>
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {author.bio && (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {author.bio}
        </p>
      )}

      {/* Contact Information */}
      {(author.email || author.phone || author.website) && (
        <div className="space-y-3 pt-4 border-t border-violet-200/30 dark:border-slate-700/30">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</p>
          <div className="space-y-2">
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
              >
                <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
                <span>{author.email}</span>
              </a>
            )}
            {author.phone && (
              <a
                href={`tel:${author.phone}`}
                className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
              >
                <Smartphone className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
                <span>{author.phone}</span>
              </a>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
              >
                <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
                <span className="truncate">{author.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorCard;

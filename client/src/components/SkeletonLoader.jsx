import React from 'react';

export const BlogCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-video bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          </div>
        </div>
        <div className="flex-1 space-y-3 mb-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
};

export const BlogDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/12" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/12" />
        </div>
      </div>
      <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="h-32 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl animate-pulse p-6 flex flex-col justify-between">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
    </div>
  );
};

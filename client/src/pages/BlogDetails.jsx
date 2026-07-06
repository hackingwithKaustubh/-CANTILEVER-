import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { BlogDetailSkeleton } from '../components/SkeletonLoader';
import { 
  Heart, Bookmark, Share2, Calendar, Clock, 
  ChevronRight, MessageSquare, Trash2, Edit3, 
  Send, Flag, Reply, CornerDownRight, ThumbsUp
} from 'lucide-react';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  
  // Reading Progress Bar State
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Comments State
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Likes & Bookmark State
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Table of Contents State
  const [toc, setToc] = useState([]);
  
  const contentContainerRef = useRef(null);

  useEffect(() => {
    fetchBlogDetails();
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [slug]);

  // Manage reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse Headings to generate Table of Contents
  useEffect(() => {
    if (blog && contentContainerRef.current) {
      const headingElements = contentContainerRef.current.querySelectorAll('h1, h2, h3');
      const headingsData = [];
      
      headingElements.forEach((el, idx) => {
        // Generate an ID if not exists
        const id = el.id || `heading-${idx}`;
        el.id = id;
        
        headingsData.push({
          id,
          text: el.innerText,
          level: el.tagName.toLowerCase()
        });
      });
      setToc(headingsData);
    }
  }, [blog]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/slug/${slug}`);
      if (res.data.success) {
        const fetchedBlog = res.data.blog;
        setBlog(fetchedBlog);
        
        // Update user-specific likes & bookmarks state
        if (user) {
          setIsLiked(fetchedBlog.likes.includes(user._id));
          setIsBookmarked(user.savedBlogs?.includes(fetchedBlog._id) || false);
        }

        // Fetch related posts
        fetchRelatedBlogs(fetchedBlog.category?._id, fetchedBlog._id);
        // Fetch comments
        fetchComments(fetchedBlog._id);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Could not fetch blog details');
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (categoryId, currentBlogId) => {
    try {
      const res = await api.get(`/blogs?limit=3`);
      if (res.data.success) {
        // Filter out current blog
        setRelated(res.data.blogs.filter(b => b._id !== currentBlogId));
      }
    } catch (err) {
      console.error('Related posts error:', err.message);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      const res = await api.get(`/comments/blog/${blogId}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err.message);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.warning('Please sign in to like articles');
      return;
    }
    try {
      const res = await api.post(`/blogs/${blog._id}/like`);
      if (res.data.success) {
        setBlog(prev => ({ ...prev, likes: res.data.likes }));
        setIsLiked(res.data.isLiked);
      }
    } catch (err) {
      toast.error('Error liking article');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.warning('Please sign in to bookmark articles');
      return;
    }
    try {
      const res = await api.post(`/blogs/${blog._id}/bookmark`);
      if (res.data.success) {
        setIsBookmarked(res.data.isBookmarked);
        toast.success(res.data.isBookmarked ? 'Article bookmarked' : 'Bookmark removed');
      }
    } catch (err) {
      toast.error('Error bookmarking article');
    }
  };

  const handleDeleteBlog = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const res = await api.delete(`/blogs/${blog._id}`);
        if (res.data.success) {
          toast.success('Blog deleted successfully');
          navigate('/dashboard');
        }
      } catch (err) {
        toast.error('Error deleting article');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please sign in to comment');
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      const res = await api.post('/comments', {
        blog: blog._id,
        content: newCommentText
      });
      if (res.data.success) {
        setComments(prev => [res.data.comment, ...prev]);
        setNewCommentText('');
        toast.success('Comment posted');
      }
    } catch (err) {
      toast.error('Error posting comment');
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await api.post('/comments', {
        blog: blog._id,
        content: replyText,
        parentComment: commentId
      });
      if (res.data.success) {
        setComments(prev => [...prev, res.data.comment]);
        setReplyText('');
        setActiveReplyId(null);
        toast.success('Reply posted');
      }
    } catch (err) {
      toast.error('Error replying');
    }
  };

  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await api.put(`/comments/${commentId}`, { content: editText });
      if (res.data.success) {
        setComments(prev => prev.map(c => c._id === commentId ? res.data.comment : c));
        setEditingCommentId(null);
        setEditText('');
        toast.success('Comment updated');
      }
    } catch (err) {
      toast.error('Error updating comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await api.delete(`/comments/${commentId}`);
        if (res.data.success) {
          setComments(prev => prev.filter(c => c._id !== commentId));
          toast.success('Comment deleted');
        }
      } catch (err) {
        toast.error('Error deleting comment');
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;
    try {
      const res = await api.post(`/comments/${commentId}/like`);
      if (res.data.success) {
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: res.data.likes } : c));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      const res = await api.post(`/comments/${commentId}/report`);
      if (res.data.success) {
        toast.info('Comment reported to administrators for review');
      }
    } catch (err) {
      toast.error('Error reporting comment');
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  if (loading) return <BlogDetailSkeleton />;
  if (!blog) return <div className="text-center py-20">Post not found.</div>;

  const isOwner = user && blog.author?._id === user._id;

  // Organize Comments into nested trees
  const topLevelComments = comments.filter(c => !c.parentComment);
  const getRepliesForComment = (commentId) => {
    return comments.filter(c => c.parentComment === commentId);
  };

  return (
    <div>
      {/* Scroll Reading Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Category Badge & Controls */}
        <div className="flex justify-between items-center mb-6">
          <Link to={`/blogs?category=${blog.category?.slug}`} className="inline-flex items-center px-4 py-1.5 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 text-xs font-bold rounded-full border border-violet-100 dark:border-violet-800">
            {blog.category?.name}
          </Link>
          
          {/* Owner/Admin Controls */}
          {(isOwner || isAdmin) && (
            <div className="flex items-center space-x-2">
              <Link to={`/edit-blog/${blog._id}`} className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl transition-all">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Link>
              <button onClick={handleDeleteBlog} className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 dark:hover:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 rounded-xl transition-all">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight font-display">
            {blog.title}
          </h1>
          {blog.subtitle && (
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              {blog.subtitle}
            </p>
          )}

          {/* Author info & Read statistics */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-y border-slate-200/50 dark:border-slate-800/50 py-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={blog.author?.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                alt=""
                className="h-12 w-12 rounded-full object-cover border border-slate-100 dark:border-slate-800"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{blog.author?.name}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>@{blog.author?.username}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1"><Calendar className="h-3 w-3" /> <span>{new Date(blog.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-400 sm:self-center">
              <span className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{blog.readTime} min read</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Heart className={`h-4 w-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                <span>{blog.likes?.length || 0} Likes</span>
              </span>
              <span>{blog.views || 0} Views</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-slate-100 dark:bg-slate-900 shadow-md">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Layout details (Content + Table of Contents Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-12">
            <div 
              ref={contentContainerRef}
              className="prose prose-indigo dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Social Sharing & Action Trays */}
            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850'}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-xl border transition-all ${isBookmarked ? 'bg-violet-50 border-violet-100 text-violet-600 dark:bg-violet-950/20 dark:border-violet-900/40 dark:text-violet-400' : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850'}`}
                  title="Bookmark"
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Share */}
              <div className="flex items-center space-x-1 text-slate-400">
                <button onClick={copyUrlToClipboard} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" title="Copy Link">
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Comments Thread Section */}
            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-12 space-y-8">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5.5 w-5.5 text-violet-500" />
                <h3 className="text-xl font-bold dark:text-white font-display">Discussion ({comments.length})</h3>
              </div>

              {/* Comment Input */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-4">
                  <img src={user.profilePicture} alt="" className="h-9 w-9 rounded-full object-cover border" />
                  <div className="flex-1 relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-violet-500/20 p-1">
                    <input
                      type="text"
                      placeholder="Add to the discussion..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none dark:text-slate-100"
                    />
                    <button type="submit" className="p-2 bg-violet-650 hover:bg-violet-750 text-white rounded-xl transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-5 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Please <Link to="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">Sign In</Link> to share comments and participate in the discussion.
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {topLevelComments.map((comment) => {
                  const replies = getRepliesForComment(comment._id);
                  return (
                    <div key={comment._id} className="space-y-4">
                      {/* Parent Comment */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/30 rounded-2xl flex gap-3">
                        <img src={comment.user?.profilePicture} alt="" className="h-8 w-8 rounded-full object-cover mt-0.5" />
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold dark:text-white">@{comment.user?.username}</span>
                            <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {editingCommentId === comment._id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-3 py-1 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                              />
                              <button onClick={() => handleEditSubmit(comment._id)} className="px-3 py-1 bg-violet-600 text-white text-xs rounded-xl">Save</button>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                          )}

                          <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400">
                            <button onClick={() => handleLikeComment(comment._id)} className="flex items-center space-x-1 hover:text-rose-500">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>{comment.likes?.length || 0}</span>
                            </button>
                            {user && (
                              <button onClick={() => setActiveReplyId(comment._id)} className="flex items-center space-x-1 hover:text-violet-500">
                                <Reply className="h-3.5 w-3.5" />
                                <span>Reply</span>
                              </button>
                            )}
                            <button onClick={() => handleReportComment(comment._id)} className="hover:text-amber-500" title="Report comment">
                              <Flag className="h-3.5 w-3.5" />
                            </button>
                            {(user && (comment.user?._id === user._id || isAdmin)) && (
                              <>
                                <button onClick={() => { setEditingCommentId(comment._id); setEditText(comment.content); }} className="hover:text-indigo-500">Edit</button>
                                <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-500">Delete</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Input Box */}
                      {activeReplyId === comment._id && (
                        <div className="ml-12 flex gap-2">
                          <input
                            type="text"
                            placeholder={`Reply to @${comment.user?.username}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl text-xs"
                          />
                          <button onClick={() => handleReplySubmit(comment._id)} className="px-4 py-1.5 bg-violet-650 hover:bg-violet-750 text-white text-xs font-semibold rounded-xl">Reply</button>
                          <button onClick={() => setActiveReplyId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-xl">Cancel</button>
                        </div>
                      )}

                      {/* Nested Replies Rendering */}
                      {replies.map((reply) => (
                        <div key={reply._id} className="ml-12 p-4 bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/10 dark:border-slate-850/10 rounded-2xl flex gap-3">
                          <CornerDownRight className="h-4 w-4 text-slate-400 shrink-0" />
                          <img src={reply.user?.profilePicture} alt="" className="h-7 w-7 rounded-full object-cover" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold dark:text-white">@{reply.user?.username}</span>
                              <span className="text-[10px] text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
                            
                            <div className="flex items-center space-x-3 pt-1 text-[10px] text-slate-400">
                              <button onClick={() => handleLikeComment(reply._id)} className="flex items-center space-x-1 hover:text-rose-500">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes?.length || 0}</span>
                              </button>
                              {(user && (reply.user?._id === user._id || isAdmin)) && (
                                <button onClick={() => handleDeleteComment(reply._id)} className="hover:text-red-500">Delete</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            {toc.length > 0 && (
              <div className="sticky top-24 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Table of Contents</h3>
                <nav className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {toc.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1 ${heading.level === 'h1' ? 'font-semibold' : heading.level === 'h2' ? 'pl-3 text-slate-500' : 'pl-6 text-slate-400 text-xs'}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Articles Panel */}
            {related.length > 0 && (
              <div className="sticky top-[450px] p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((relBlog) => (
                    <div key={relBlog._id} className="flex space-x-3.5">
                      <img src={relBlog.coverImage} alt="" className="h-12 w-16 object-cover rounded-lg bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/blog/${relBlog.slug}`} className="block text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-violet-600 line-clamp-2 leading-snug">
                          {relBlog.title}
                        </Link>
                        <p className="text-[10px] text-slate-400 mt-1">{relBlog.readTime} min read</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { 
  User, Edit, BookOpen, FileText, Bookmark, 
  Heart, BarChart3, Upload, Loader2, Eye, Award, 
  PlusCircle, Trash2, Edit3 
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('published'); // tabs: published, drafts, saved, edit-profile, analytics

  const [myBlogs, setMyBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    fetchMyBlogs();
    fetchSavedBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/my-blogs');
      if (res.data.success) {
        setMyBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedBlogs = async () => {
    try {
      const res = await api.get('/users/saved');
      if (res.data.success) {
        setSavedBlogs(res.data.savedBlogs);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAvatarChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (file) {
      formData.append('profilePicture', file);
    }

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setActiveTab('published');
    } catch (err) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const res = await api.delete(`/blogs/${blogId}`);
        if (res.data.success) {
          toast.success('Blog deleted successfully');
          setMyBlogs(prev => prev.filter(b => b._id !== blogId));
        }
      } catch (err) {
        toast.error('Error deleting article');
      }
    }
  };

  // Filter user blogs by status
  const publishedBlogs = myBlogs.filter(b => b.status === 'published');
  const draftBlogs = myBlogs.filter(b => b.status === 'draft');

  // Compute analytics
  const totalViews = publishedBlogs.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLikes = publishedBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Profile Overview Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <img
            src={preview || 'https://api.dicebear.com/7.x/adventurer/svg'}
            alt=""
            className="h-20 w-20 rounded-full object-cover border-2 border-white/50 bg-white/10 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-black font-display">{user?.name}</h1>
            <p className="text-violet-100 text-sm">@{user?.username} • {user?.email}</p>
            <p className="text-violet-200 text-xs italic line-clamp-1 max-w-md">{user?.bio || 'No bio written yet.'}</p>
          </div>
        </div>

        <Link
          to="/create-blog"
          className="flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-violet-700 font-bold rounded-2xl shadow-md transition-all shrink-0 text-sm"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Write New Post</span>
        </Link>
      </div>

      {/* Grid Layout (Sidebar Navigation + Tab Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 flex flex-col space-y-1 shadow-sm">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'published' ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Published ({publishedBlogs.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'drafts' ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <FileText className="h-4 w-4" />
              <span>Drafts ({draftBlogs.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'saved' ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved Blogs ({savedBlogs.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'analytics' ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('edit-profile')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'edit-profile' ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <User className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="lg:col-span-3">
          
          {/* Tab: Published Blogs */}
          {activeTab === 'published' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white font-display">Published Articles</h2>
              {publishedBlogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm text-slate-400">You haven't published any articles yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                  {publishedBlogs.map(blog => (
                    <div key={blog._id} className="flex justify-between items-center py-4 first:pt-0">
                      <div className="flex gap-4">
                        <img src={blog.coverImage} alt="" className="h-14 w-20 object-cover rounded-xl bg-slate-100" />
                        <div>
                          <Link to={`/blog/${blog.slug}`} className="font-bold text-slate-900 dark:text-white hover:text-violet-600 line-clamp-1">{blog.title}</Link>
                          <p className="text-xs text-slate-400 mt-1">{new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime} min read</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/edit-blog/${blog._id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-violet-600" title="Edit"><Edit3 className="h-4.5 w-4.5" /></Link>
                        <button onClick={() => handleDeleteBlog(blog._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-650" title="Delete"><Trash2 className="h-4.5 w-4.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Draft Blogs */}
          {activeTab === 'drafts' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white font-display">Draft Articles</h2>
              {draftBlogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm text-slate-400">No draft articles stored.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                  {draftBlogs.map(blog => (
                    <div key={blog._id} className="flex justify-between items-center py-4 first:pt-0">
                      <div className="flex gap-4">
                        <img src={blog.coverImage} alt="" className="h-14 w-20 object-cover rounded-xl bg-slate-100" />
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{blog.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">Saved on {new Date(blog.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/edit-blog/${blog._id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-violet-600" title="Edit/Publish"><Edit3 className="h-4.5 w-4.5" /></Link>
                        <button onClick={() => handleDeleteBlog(blog._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-slate-500 hover:text-red-650" title="Delete"><Trash2 className="h-4.5 w-4.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Saved Blogs */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white font-display">Saved Bookmarks</h2>
              {savedBlogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm text-slate-400">No bookmarked articles saved yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                  {savedBlogs.map(blog => (
                    <div key={blog._id} className="flex justify-between items-center py-4 first:pt-0">
                      <div className="flex gap-4">
                        <img src={blog.coverImage} alt="" className="h-14 w-20 object-cover rounded-xl bg-slate-100" />
                        <div>
                          <Link to={`/blog/${blog.slug}`} className="font-bold text-slate-900 dark:text-white hover:text-violet-600 line-clamp-1">{blog.title}</Link>
                          <p className="text-xs text-slate-400 mt-1">By {blog.author?.name} • Category: {blog.category?.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white font-display">Author Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-xl"><Eye className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-extrabold dark:text-white">{totalViews}</p>
                    <p className="text-xs text-slate-400">Total Views</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl"><Heart className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-extrabold dark:text-white">{totalLikes}</p>
                    <p className="text-xs text-slate-400">Total Likes</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl"><FileText className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-extrabold dark:text-white">{publishedBlogs.length}</p>
                    <p className="text-xs text-slate-400">Articles Published</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Edit Profile */}
          {activeTab === 'edit-profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white font-display">Edit Profile Details</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                
                {/* Photo Update */}
                <div className="flex items-center space-x-4">
                  <img src={preview || 'https://api.dicebear.com/7.x/adventurer/svg'} alt="" className="h-16 w-16 rounded-full object-cover border" />
                  <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-350 rounded-xl border cursor-pointer transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biography</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 text-sm h-28 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="flex items-center justify-center space-x-2 py-2.5 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm"
                >
                  {updatingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

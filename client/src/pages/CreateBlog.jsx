import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import { Loader2, Upload, Save, ArrowLeft } from 'lucide-react';

const CreateBlog = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlogForEdit();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
        if (!id && res.data.categories.length > 0) {
          setCategory(res.data.categories[0]._id); 
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  const fetchBlogForEdit = async () => {
    try {
      setFetching(true);
      // Fetch blog details by slug or ID
      // To get drafts or edit details correctly, we list users posts and filter or query directly.
      // For convenience, we can query by id or slug
      const res = await api.get(`/blogs`); // Let's get the list of user blogs and find the matching ID, or fetch details.
      // Wait, we can add a specific get details by ID endpoint if slug isn't enough, but blogController has updates mapping.
      // Let's call blogs endpoint. Wait, the blogController updates /:id handles edit. Let's list and match.
      const blogsRes = await api.get('/blogs/my-blogs');
      if (blogsRes.data.success) {
        const targetBlog = blogsRes.data.blogs.find(b => b._id === id);
        if (targetBlog) {
          setTitle(targetBlog.title);
          setSubtitle(targetBlog.subtitle || '');
          setContent(targetBlog.content);
          setCategory(targetBlog.category?._id || targetBlog.category);
          setTags(targetBlog.tags?.join(', ') || '');
          setStatus(targetBlog.status);
          setPreview(targetBlog.coverImage);
        } else {
          toast.error('Blog not found or unauthorized');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Error fetching blog data');
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      toast.error('Please enter Title, Content, and Category');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('status', status);
    if (file) {
      formData.append('coverImage', file);
    }

    try {
      if (id) {
        // Edit Blog
        const res = await api.put(`/blogs/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          toast.success('Blog post updated successfully!');
          navigate(`/blog/${res.data.blog.slug}`);
        }
      } else {
        // Create Blog
        const res = await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          toast.success('Blog post created successfully!');
          navigate(`/blog/${res.data.blog.slug}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white font-display">
          {id ? 'Edit Article' : 'Create Article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title & Subtitle */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 focus:border-violet-500 focus:outline-none py-3 text-2xl sm:text-3xl font-bold dark:text-white transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Subtitle or short description..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200/50 dark:border-slate-850/50 focus:border-violet-500 focus:outline-none py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors"
          />
        </div>

        {/* Cover Photo Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Cover Image</label>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl">
            {preview && (
              <img src={preview} alt="Cover Preview" className="h-28 w-44 object-cover rounded-xl shadow-sm bg-white" />
            )}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-xs text-slate-400">Recommendation: use clean high-resolution landscape images. Limit 5MB.</p>
              <label className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-full cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload cover picture</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Categories, Tags & Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 text-sm"
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node, WebDev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 text-sm"
            >
              <option value="published">Publish immediately</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>
        </div>

        {/* Content Custom Editor */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Article Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Submit Control */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center space-x-2 py-3 px-6 bg-violet-650 hover:bg-violet-750 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save className="h-4.5 w-4.5" />
              <span>{id ? 'Save Changes' : 'Create & Publish'}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default CreateBlog;

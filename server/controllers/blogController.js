const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const numberOfWords = content.split(/\s+/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};

const getBlogs = async (req, res) => {
  try {
    const { category, search, tag, author, status, page = 1, limit = 9 } = req.query;
    const query = {};

    // Default to published, but user can query drafts if authenticated
    query.status = status || 'published';

    if (category) {
      const catObj = await Category.findOne({ slug: category });
      if (catObj) {
        query.category = catObj._id;
      } else {
        return res.status(200).json({ success: true, blogs: [], totalPages: 0, currentPage: 1 });
      }
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) {
        query.author = author;
      } else {
        const userObj = await User.findOne({ username: author });
        if (userObj) {
          query.author = userObj._id;
        } else {
          return res.status(200).json({ success: true, blogs: [], totalPages: 0, currentPage: 1 });
        }
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'name username profilePicture location phone website')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalBlogs = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: Number(page),
      totalBlogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching blogs' });
  }
};

const getTrendingBlogs = async (req, res) => {
  try {
    // Sort by views, fallback to likes count
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'name username profilePicture location phone website')
      .populate('category', 'name slug')
      .sort({ views: -1, createdAt: -1 })
      .limit(6);
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching trending blogs' });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name username profilePicture bio location phone website')
      .populate('category', 'name slug');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching blog details' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, subtitle, content, category, tags, status } = req.body;

    let coverImage = '';
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    } else {
      coverImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60';
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let slugExists = await Blog.findOne({ slug });
    let count = 1;
    while (slugExists) {
      slug = `${baseSlug}-${count}`;
      slugExists = await Blog.findOne({ slug });
      count++;
    }

    const parsedTags = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];
    const readTime = calculateReadTime(content);

    const blog = await Blog.create({
      title,
      subtitle,
      slug,
      content,
      coverImage,
      author: req.user._id,
      category,
      tags: parsedTags,
      status: status || 'draft',
      readTime
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('Error creating blog:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating blog' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this blog' });
    }

    const { title, subtitle, content, category, tags, status } = req.body;

    if (title && title !== blog.title) {
      blog.title = title;
      let baseSlug = slugify(title);
      let slug = baseSlug;
      let slugExists = await Blog.findOne({ slug, _id: { $ne: blog._id } });
      let count = 1;
      while (slugExists) {
        slug = `${baseSlug}-${count}`;
        slugExists = await Blog.findOne({ slug, _id: { $ne: blog._id } });
        count++;
      }
      blog.slug = slug;
    }

    if (subtitle !== undefined) blog.subtitle = subtitle;
    if (content !== undefined) {
      blog.content = content;
      blog.readTime = calculateReadTime(content);
    }
    if (category) blog.category = category;
    if (tags) {
      blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }
    if (status) blog.status = status;

    if (req.file) {
      blog.coverImage = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating blog' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting blog' });
  }
};

const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const user = await User.findById(req.user._id);
    const isLiked = blog.likes.includes(req.user._id);

    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== req.user._id.toString());
      user.likedBlogs = user.likedBlogs.filter(id => id.toString() !== blog._id.toString());
    } else {
      blog.likes.push(req.user._id);
      user.likedBlogs.push(blog._id);

      if (blog.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: blog.author,
          sender: req.user._id,
          type: 'like',
          blog: blog._id
        });
      }
    }

    await blog.save();
    await user.save();

    res.status(200).json({ success: true, likes: blog.likes, isLiked: !isLiked });
  } catch (error) {
    console.error('Error toggling like:', error.message);
    res.status(500).json({ success: false, message: 'Server error toggling like' });
  }
};

const toggleBookmarkBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blogId = req.params.id;
    const isBookmarked = user.savedBlogs.includes(blogId);

    if (isBookmarked) {
      user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
    } else {
      user.savedBlogs.push(blogId);
    }

    await user.save();
    res.status(200).json({ success: true, savedBlogs: user.savedBlogs, isBookmarked: !isBookmarked });
  } catch (error) {
    console.error('Error toggling bookmark:', error.message);
    res.status(500).json({ success: false, message: 'Server error toggling bookmark' });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user blogs' });
  }
};

module.exports = {
  getBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  toggleBookmarkBlog,
  getMyBlogs
};

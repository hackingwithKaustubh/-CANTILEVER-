const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  toggleBookmarkBlog,
  getMyBlogs
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { blogValidationRules } = require('../middleware/validationMiddleware');

router.get('/', getBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/my-blogs', protect, getMyBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.post('/', protect, upload.single('coverImage'), blogValidationRules, createBlog);
router.put('/:id', protect, upload.single('coverImage'), blogValidationRules, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLikeBlog);
router.post('/:id/bookmark', protect, toggleBookmarkBlog);

module.exports = router;

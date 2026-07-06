const express = require('express');
const router = express.Router();
const {
  getBlogComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  reportComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { commentValidationRules } = require('../middleware/validationMiddleware');

router.get('/blog/:blogId', getBlogComments);
router.post('/', protect, commentValidationRules, createComment);
router.put('/:id', protect, commentValidationRules, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleLikeComment);
router.post('/:id/report', protect, reportComment);

module.exports = router;

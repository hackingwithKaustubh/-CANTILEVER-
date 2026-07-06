const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCategories);
router.post('/', protect, admin, upload.single('image'), createCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;

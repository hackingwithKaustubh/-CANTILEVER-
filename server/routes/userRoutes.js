const express = require('express');
const router = express.Router();
const { updateProfile, getSavedBlogs, getNotifications, markNotificationsRead } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/saved', protect, getSavedBlogs);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;

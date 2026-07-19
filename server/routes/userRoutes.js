const express = require('express');
const router = express.Router();
const { updateProfile, getSavedBlogs, getNotifications, markNotificationsRead, getAuthorProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/saved', protect, getSavedBlogs);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.get('/profile/:username', getAuthorProfile);

module.exports = router;

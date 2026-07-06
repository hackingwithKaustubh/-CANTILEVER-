const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const { registerValidationRules, loginValidationRules } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', upload.single('profilePicture'), registerValidationRules, register);
router.post('/login', loginValidationRules, login);
router.get('/me', protect, getMe);

module.exports = router;

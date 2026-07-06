const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidationRules = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const blogValidationRules = [
  body('title').trim().notEmpty().withMessage('Blog title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('content').trim().notEmpty().withMessage('Blog content is required'),
  body('category').notEmpty().withMessage('Blog category is required'),
  validate
];

const commentValidationRules = [
  body('content').trim().notEmpty().withMessage('Comment content cannot be empty'),
  body('blog').notEmpty().withMessage('Blog ID is required'),
  validate
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  blogValidationRules,
  commentValidationRules
};

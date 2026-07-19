const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getReportedComments,
  toggleUserRole,
  deleteUser,
  dismissReportedComment
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/reports', getReportedComments);
router.put('/users/:id/role', toggleUserRole);
router.delete('/users/:id', deleteUser);
router.put('/reports/:id/dismiss', dismissReportedComment);

module.exports = router;

const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalComments = await Comment.countDocuments({});

    const viewStats = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewStats.length > 0 ? viewStats[0].totalViews : 0;

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const populatedCategoryStats = await Promise.all(
      categoryStats.map(async (stat) => {
        const category = await Category.findById(stat._id);
        return {
          category: category ? category.name : 'Uncategorized',
          count: stat.count
        };
      })
    );

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyStats = await Blog.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'published' } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          blogs: { $sum: 1 },
          views: { $sum: '$views' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthNum = d.getMonth() + 1;
      const yearNum = d.getFullYear();

      const matched = monthlyStats.find(
        (s) => s._id.month === monthNum && s._id.year === yearNum
      );

      chartData.push({
        month: `${months[monthNum - 1]} ${yearNum}`,
        blogs: matched ? matched.blogs : 0,
        views: matched ? matched.views : 0
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
        totalViews,
        categoryStats: populatedCategoryStats,
        monthlyStats: chartData
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users list' });
  }
};

const getReportedComments = async (req, res) => {
  try {
    const comments = await Comment.find({ isReported: true })
      .populate('user', 'name username profilePicture')
      .populate('blog', 'title slug')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching reported comments' });
  }
};

const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own administrative role' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.status(200).json({ success: true, user: { _id: user._id, role: user.role, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error toggling user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own administrative account' });
    }

    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and all associated blogs/comments deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

const dismissReportedComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.isReported = false;
    await comment.save();

    res.status(200).json({ success: true, message: 'Comment report dismissed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error dismissing comment report' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getReportedComments,
  toggleUserRole,
  deleteUser,
  dismissReportedComment
};

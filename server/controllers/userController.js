const User = require('../models/User');
const Notification = require('../models/Notification');
const Blog = require('../models/Blog');

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

const getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedBlogs',
      populate: [
        { path: 'author', select: 'name username profilePicture' },
        { path: 'category', select: 'name slug' }
      ]
    });
    res.status(200).json({ success: true, savedBlogs: user.savedBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching saved blogs' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name username profilePicture')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching notifications' });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating notifications' });
  }
};

const getAuthorProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get author profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching author profile' });
  }
};

module.exports = {
  updateProfile,
  getSavedBlogs,
  getNotifications,
  markNotificationsRead,
  getAuthorProfile
};

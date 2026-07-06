const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');

const getBlogComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('user', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching comments' });
  }
};

const createComment = async (req, res) => {
  try {
    const { blog, content, parentComment } = req.body;

    const blogObj = await Blog.findById(blog);
    if (!blogObj) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = await Comment.create({
      blog,
      user: req.user._id,
      content,
      parentComment: parentComment || null
    });

    const populatedComment = await comment.populate('user', 'name username profilePicture');

    // Create Notification
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent && parent.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: parent.user,
          sender: req.user._id,
          type: 'reply',
          blog: blog,
          comment: comment._id
        });
      }
    } else if (blogObj.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blogObj.author,
        sender: req.user._id,
        type: 'comment',
        blog: blogObj._id,
        comment: comment._id
      });
    }

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating comment' });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    comment.content = req.body.content || comment.content;
    const updatedComment = await comment.save();
    const populatedComment = await updatedComment.populate('user', 'name username profilePicture');

    res.status(200).json({ success: true, comment: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Allow author or admin to delete comment
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting comment' });
  }
};

const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(req.user._id);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.status(200).json({ success: true, likes: comment.likes, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error toggling comment like' });
  }
};

const reportComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.isReported = true;
    await comment.save();

    res.status(200).json({ success: true, message: 'Comment reported successfully for moderation review' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error reporting comment' });
  }
};

module.exports = {
  getBlogComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  reportComment
};

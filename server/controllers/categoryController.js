const Category = require('../models/Category');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name);
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      image = `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60`;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting category' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};

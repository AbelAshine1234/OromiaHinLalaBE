const User = require('../models/User');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Only create image record and set profile_picture_id if file was uploaded
    if (req.file) {
      const newImage = await Image.create({
        image_id: req.file.filename,
        image_url: req.file.path,
      });
      data.profile_picture_id = newImage.id;
    } else {
      // Ensure profile_picture_id is null if no file uploaded
      data.profile_picture_id = null;
    }
    
    const newUser = await User.create(data);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await User.findByPk(req.params.id);

    if (req.file) {
      if (user.profile_picture_id) {
        const oldImage = await Image.findByPk(user.profile_picture_id);
        if (oldImage) {
          await cloudinary.uploader.destroy(oldImage.image_id);
          await oldImage.destroy();
        }
      }
      const newImage = await Image.create({
        image_id: req.file.filename,
        image_url: req.file.path,
      });
      data.profile_picture_id = newImage.id;
    }

    const [updated] = await User.update(data, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Image = require('../models/Image');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, surname, country, phone_number, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      name,
      surname,
      country,
      phone_number,
      password: hashedPassword,
      role: role || 'tourist' // Default role is tourist
    };

    // Handle profile picture if uploaded
    if (req.file) {
      const newImage = await Image.create({
        image_id: req.file.filename,
        image_url: req.file.path,
      });
      data.profile_picture_id = newImage.id;
    }

    const newUser = await User.create(data);

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      surname: newUser.surname,
      country: newUser.country,
      phone_number: newUser.phone_number,
      role: newUser.role,
      profile_picture_id: newUser.profile_picture_id,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone_number: user.phone_number,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      country: user.country,
      phone_number: user.phone_number,
      role: user.role,
      profile_picture_id: user.profile_picture_id,
      checked_out: user.checked_out,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash password if it's being updated
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    // Handle profile picture update
    if (req.file) {
      if (user.profile_picture_id) {
        const oldImage = await Image.findByPk(user.profile_picture_id);
        if (oldImage) {
          // Note: You might want to add cloudinary cleanup here if using cloudinary
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
      where: { id: req.user.userId },
    });

    if (updated) {
      const updatedUser = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }
      });
      res.json(updatedUser);
    } else {
      res.status(400).json({ error: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.update(
      { password: hashedNewPassword },
      { where: { id: req.user.userId } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
};

// Logout (client-side token removal, but we can add token blacklisting here if needed)
exports.logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: error.message });
  }
}; 
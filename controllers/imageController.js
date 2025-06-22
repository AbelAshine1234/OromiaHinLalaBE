const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new image
exports.createImage = async (req, res) => {
  try {
    const newImage = await Image.create({
      image_id: req.file.filename,
      image_url: req.file.path,
    });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a image
exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(image.image_id);

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.file.filename,
      folder: 'oromia-hinlala',
    });
    
    const [updated] = await Image.update({
      image_id: result.public_id,
      image_url: result.secure_url,
    }, {
      where: { id: req.params.id },
    });
    
    if (updated) {
      const updatedImage = await Image.findByPk(req.params.id);
      res.json(updatedImage);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.image_id);
    
    const deleted = await Image.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
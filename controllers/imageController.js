const Image = require('../models/Image');

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
    const newImage = await Image.create(req.body);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a image
exports.updateImage = async (req, res) => {
  try {
    const [updated] = await Image.update(req.body, {
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
const Destination = require('../models/Destination');
const cloudinary = require('../config/cloudinary');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const newDestination = await Destination.create({
      name,
      description,
      location,
      imageUrl: req.file.path,
      imageId: req.file.filename,
    });
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a destination
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Delete old image if it exists
    if (destination.imageId) {
      await cloudinary.uploader.destroy(destination.imageId);
    }

    const data = {
      ...req.body,
    };

    if(req.file){
        data.imageUrl = req.file.path;
        data.imageId = req.file.filename;
    }

    const [updated] = await Destination.update(data, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedDestination = await Destination.findByPk(req.params.id);
      res.json(updatedDestination);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a destination
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    if (destination.imageId) {
      await cloudinary.uploader.destroy(destination.imageId);
    }
    
    const deleted = await Destination.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
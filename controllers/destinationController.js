const Destination = require('../models/Destination');

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
    const newDestination = await Destination.create(req.body);
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a destination
exports.updateDestination = async (req, res) => {
  try {
    const [updated] = await Destination.update(req.body, {
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
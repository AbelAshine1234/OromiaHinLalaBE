const Package = require('../models/Package');

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (package) {
      res.json(package);
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a package
exports.updatePackage = async (req, res) => {
  try {
    const [updated] = await Package.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPackage = await Package.findByPk(req.params.id);
      res.json(updatedPackage);
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a package
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
const Checkout = require('../models/Checkout');
const Image = require('../models/Image');
const { Op } = require('sequelize');

// Get all checkouts
exports.getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.findAll({
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });
    res.json(checkouts);
  } catch (error) {
    console.error('Error fetching checkouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get checkout by ID
exports.getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findByPk(req.params.id, {
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });
    
    if (checkout) {
      res.json(checkout);
    } else {
      res.status(404).json({ error: 'Checkout not found' });
    }
  } catch (error) {
    console.error('Error fetching checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new checkout
exports.createCheckout = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Check if phone number already exists (unique constraint)
    const existingCheckout = await Checkout.findOne({
      where: { phone_number: data.phone_number }
    });
    
    if (existingCheckout) {
      return res.status(400).json({ 
        error: 'Phone number already exists',
        details: 'A checkout with this phone number already exists'
      });
    }
    
    // Handle passport image if uploaded
    if (req.file) {
      const newImage = await Image.create({
        image_id: req.file.filename,
        image_url: req.file.path,
      });
      data.passport = newImage.id;
    }
    
    // Set default payment status if not provided
    if (data.has_paid === undefined) {
      data.has_paid = false;
    }
    
    const newCheckout = await Checkout.create(data);
    
    // Fetch the created checkout with passport image
    const createdCheckout = await Checkout.findByPk(newCheckout.id, {
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });
    
    res.status(201).json(createdCheckout);
  } catch (error) {
    console.error('Error creating checkout:', error);
    
    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({ 
        error: `${field} already exists`,
        details: `A checkout with this ${field} already exists`
      });
    }
    
    res.status(400).json({ error: error.message });
  }
};

// Update a checkout
exports.updateCheckout = async (req, res) => {
  try {
    const data = { ...req.body };
    const checkout = await Checkout.findByPk(req.params.id);
    
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }
    
    // Check if phone number is being updated and if it already exists
    if (data.phone_number && data.phone_number !== checkout.phone_number) {
      const existingCheckout = await Checkout.findOne({
        where: { 
          phone_number: data.phone_number,
          id: { [Op.ne]: req.params.id }
        }
      });
      
      if (existingCheckout) {
        return res.status(400).json({ 
          error: 'Phone number already exists',
          details: 'A checkout with this phone number already exists'
        });
      }
    }
    
    // Handle passport image update
    if (req.file) {
      // Delete old passport image if exists
      if (checkout.passport) {
        const oldImage = await Image.findByPk(checkout.passport);
        if (oldImage) {
          await oldImage.destroy();
        }
      }
      
      const newImage = await Image.create({
        image_id: req.file.filename,
        image_url: req.file.path,
      });
      data.passport = newImage.id;
    }
    
    const [updated] = await Checkout.update(data, {
      where: { id: req.params.id },
    });
    
    if (updated) {
      const updatedCheckout = await Checkout.findByPk(req.params.id, {
        include: [
          {
            model: Image,
            as: 'passportImage',
            attributes: ['id', 'image_url']
          }
        ]
      });
      res.json(updatedCheckout);
    } else {
      res.status(404).json({ error: 'Checkout not found' });
    }
  } catch (error) {
    console.error('Error updating checkout:', error);
    
    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({ 
        error: `${field} already exists`,
        details: `A checkout with this ${field} already exists`
      });
    }
    
    res.status(400).json({ error: error.message });
  }
};

// Delete a checkout
exports.deleteCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByPk(req.params.id);
    
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }
    
    // Delete associated passport image if exists
    if (checkout.passport) {
      const passportImage = await Image.findByPk(checkout.passport);
      if (passportImage) {
        await passportImage.destroy();
      }
    }
    
    await checkout.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get checkouts by payment status
exports.getCheckoutsByPaymentStatus = async (req, res) => {
  try {
    const { has_paid } = req.query;
    
    if (has_paid === undefined) {
      return res.status(400).json({ error: 'has_paid parameter is required' });
    }
    
    const checkouts = await Checkout.findAll({
      where: { has_paid: has_paid === 'true' },
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });
    
    res.json(checkouts);
  } catch (error) {
    console.error('Error fetching checkouts by payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search checkouts by name or country
exports.searchCheckouts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter is required' });
    }
    
    const checkouts = await Checkout.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { country: { [Op.iLike]: `%${q}%` } },
          { surname: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });
    
    res.json(checkouts);
  } catch (error) {
    console.error('Error searching checkouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
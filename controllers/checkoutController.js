const Checkout = require('../models/Checkout');
const Image = require('../models/Image');
const { Op } = require('sequelize');
const QRCode = require('qrcode');
const { sendQrCodeEmail } = require('../config/mailer');

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
    
    // Check if email already exists
    const existingEmail = await Checkout.findOne({
        where: { email: data.email }
    });

    if (existingEmail) {
        return res.status(400).json({
            error: 'Email already exists',
            details: 'A checkout with this email already exists'
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
    
    // Generate success URL for QR code
    const successUrl = `${req.protocol}://${req.get('host')}/api/checkouts/success/${encodeURIComponent(createdCheckout.email)}`;

    // Generate QR code as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(successUrl);

    // Send QR code email
    await sendQrCodeEmail(createdCheckout.email, qrCodeBuffer);

    res.status(201).json({ checkout: createdCheckout, successUrl });
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
    
    res.status(500).json({ error: 'Internal server error' });
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

// Verify checkout success by email
exports.verifyCheckoutSuccess = async (req, res) => {
  try {
    const checkout = await Checkout.findOne({
      where: { email: req.params.email },
      include: [
        {
          model: Image,
          as: 'passportImage',
          attributes: ['id', 'image_url']
        }
      ]
    });

    if (checkout) {
      res.send(`
        <html>
          <head>
            <title>Checkout Successful</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #4CAF50; }
              .details { margin: 20px auto; padding: 20px; border: 1px solid #ddd; max-width: 400px; }
            </style>
          </head>
          <body>
            <h1>Checkout Successful!</h1>
            <div class="details">
              <p><strong>Name:</strong> ${checkout.name} ${checkout.surname || ''}</p>
              <p><strong>Country:</strong> ${checkout.country}</p>
              <p><strong>Phone:</strong> ${checkout.phone_number}</p>
              <p><strong>Guests:</strong> ${checkout.no_of_guests}</p>
              <p><strong>Paid:</strong> ${checkout.has_paid ? 'Yes' : 'No'}</p>
            </div>
          </body>
        </html>
      `);
    } else {
      res.status(404).send('<h1>Checkout Not Found</h1>');
    }
  } catch (error) {
    console.error('Error verifying checkout:', error);
    res.status(500).send('<h1>Internal Server Error</h1>');
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
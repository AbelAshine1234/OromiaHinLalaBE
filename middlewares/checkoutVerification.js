const Joi = require('joi');

const checkoutSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  country: Joi.string().required().min(2).max(50),
  surname: Joi.string().optional().min(2).max(50),
  accomodation: Joi.string().optional().min(2).max(100),
  phone_number: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
  has_paid: Joi.boolean().optional(),
  no_of_guests: Joi.number().integer().min(1).max(20).required(),
  passport: Joi.number().integer().optional(),
});

const validateCheckout = (req, res, next) => {
  const { error } = checkoutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = {
  validateCheckout,
}; 
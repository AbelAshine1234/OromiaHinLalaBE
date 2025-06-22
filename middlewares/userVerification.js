const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  country: Joi.string().required(),
  surname: Joi.string().optional(),
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'tourist', 'employee', 'guide').required(),
  checked_out: Joi.boolean().optional(),
  profile_picture_id: Joi.number().integer().optional(),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = {
  validateUser,
}; 
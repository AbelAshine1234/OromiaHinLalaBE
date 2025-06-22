const Joi = require('joi');

const destinationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  location: Joi.string(),
});

const validateDestination = (req, res, next) => {
  const { error } = destinationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateDestination,
}; 
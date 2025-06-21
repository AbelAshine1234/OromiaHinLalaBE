const Joi = require('joi');

const imageSchema = Joi.object({
  image_id: Joi.string().required(),
  image_url: Joi.string().uri().required(),
});

const validateImage = (req, res, next) => {
  const { error } = imageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateImage,
}; 
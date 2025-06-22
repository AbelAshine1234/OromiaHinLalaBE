const Joi = require('joi');

const packageSchema = Joi.object({
  guest_house: Joi.string().required(),
  tourist_guide_id: Joi.number().integer(),
  reviews_id: Joi.number().integer(),
  stay_day: Joi.number().integer().required(),
  amount: Joi.number().positive().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

const validatePackage = (req, res, next) => {
  const { error } = packageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validatePackage,
}; 
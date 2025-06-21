const Reviews = require('../models/Reviews');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const newReview = await Reviews.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const [updated] = await Reviews.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedReview = await Reviews.findByPk(req.params.id);
      res.json(updatedReview);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Reviews.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
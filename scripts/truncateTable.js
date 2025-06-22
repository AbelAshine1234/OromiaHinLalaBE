const sequelize = require('../config/db'); // Adjust path accordingly
const Destination = require('../models/Destination');
const Image = require('../models/Image');
const User = require('../models/User');
const Package = require('../models/Package');
const Reviews = require('../models/Reviews');
const Checkout = require("../models/Checkout");

async function truncateTables() {
  try {
    // Disable FK checks - adjust for your DB dialect (this example is for MySQL)
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Truncate tables explicitly
    await Destination.truncate({ cascade: true });
    await Image.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Package.truncate({ cascade: true });
    await Reviews.truncate({ cascade: true });
    await Checkout.truncate({ cascade: true });

    // Re-enable FK checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("All tables truncated successfully!");
  } catch (error) {
    console.error("Error truncating tables:", error);
  }
}

truncateTables();

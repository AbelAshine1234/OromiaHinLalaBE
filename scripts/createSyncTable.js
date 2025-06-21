const sequelize = require('../config/db'); // Sequelize instance
const Destination = require('../models/Destination');
const Image = require('../models/Image');
const User = require('../models/User');
const Package = require('../models/Package');
const Reviews = require('../models/Reviews');

async function syncTables() {
    try {
        await sequelize.sync({ alter: true });

        

        console.log('✅ All tables synchronized successfully!');
    } catch (error) {
        console.error('❌ Error synchronizing tables:', error);
    } finally {
        await sequelize.close();
    }
}

syncTables();

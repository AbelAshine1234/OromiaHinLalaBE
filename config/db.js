// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME || 'oromia',
    username: process.env.DATABASE_USERNAME || 'abel',
    password: process.env.DATABASE_PASSWORD || '0512',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres',
    logging: true  
});

module.exports = sequelize;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    } 
}, {
    timestamps: true,
});

module.exports = Image;

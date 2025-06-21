const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Image = require("./Image");
const User = require('./User');
const Reviews = require('./Reviews');

const Package = sequelize.define('Package', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guest_house: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tourist_guide_id: {  
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'SET NULL' 
    },
    reviews_id: {  
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: Reviews,
            key: 'id'
        },
        onDelete: 'SET NULL'  
    },
    stay_day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Package;

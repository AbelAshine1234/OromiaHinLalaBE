const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Image = require("./Image")

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
   
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM( 'admin', 'tourist', 'employee','guide' ),
        allowNull: false
    },
    checked_out: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    profile_picture_id: { // Foreign key linking to Image model
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Image,
            key: 'id'
        },
        onDelete: 'SET NULL' // If profile picture is deleted, set to NULL
    }
    
}, {
    timestamps: true
});

module.exports = User;
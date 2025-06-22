const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Image = require("./Image");

const Checkout = sequelize.define(
  "Checkout",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accomodation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    has_paid:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    },
    no_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    passport: {
      // Foreign key linking to Image model
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Images',
        key: "id",
      },
      onDelete: "SET NULL", // If passport image is deleted, set to NULL
    },
  },
  {
    timestamps: true,
  }
);

// Define association with Image model
Checkout.belongsTo(Image, { 
  foreignKey: 'passport', 
  as: 'passportImage' 
});

module.exports = Checkout;

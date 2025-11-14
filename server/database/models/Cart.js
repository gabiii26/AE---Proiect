// server/database/models/Cart.js
const { sequelize } = require("../server");
const { DataTypes } = require("sequelize");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    items: {
      type: DataTypes.JSON, // stocăm item-urile ca JSON
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "carts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Cart;

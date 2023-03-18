const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validateEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// User.sync({ force: true });
module.exports = User;

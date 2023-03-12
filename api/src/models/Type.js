const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");

const Type = sequelize.define(
  "types",
  {
    typeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Type.sync({ force: true });
module.exports = Type;

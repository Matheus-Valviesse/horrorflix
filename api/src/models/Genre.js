const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");

const Genre = sequelize.define(
  "genres",
  {
    genreId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Genre.sync({ force: true });
module.exports = Genre;

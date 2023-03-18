const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        required: false,
      },
    },
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("banco de dados conectado com sucesso.");
  } catch (error) {
    console.log(error);
  }
};

connectDatabase();

module.exports = sequelize;

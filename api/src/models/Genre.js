const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");
const User = require("./User.js");

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Genre.sync({ force: true });

// O planetScale não aceita foreign keys então é necessario
// a criação de um indice paralelo que ainda assim garante
// a relação entre as entidades, segue abaixo o codido
// utilizado para resolver o problema:

// // Criando um índice secundário na coluna 'userId' da tabela 'tokens'
// const createIndexQuery = "CREATE INDEX userId_index ON genres (userId);";

// // Executando a consulta SQL personalizada usando o método query() do Sequelize
// const f = async () => {
//   await sequelize.query(createIndexQuery);
// };

// Genre.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Genre, { foreignKey: "userId" });
// Genre.hasMany(User, { foreignKey: "userId" });


module.exports = Genre;

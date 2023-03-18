const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");
const User = require("./User.js");

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
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps: false,
  }
);

// Type.sync({ force: true });

// O planetScale não aceita foreign keys então é necessario
// a criação de um indice paralelo que ainda assim garante
// a relação entre as entidades, segue abaixo o codido
// utilizado para resolver o problema:

// // Criando um índice secundário na coluna 'userId' da tabela 'tokens'
// const createIndexQuery = "CREATE INDEX userId_index ON types (userId);";

// // Executando a consulta SQL personalizada usando o método query() do Sequelize

// const f = async () => {
//   await sequelize.query(createIndexQuery);
// };
// f

// Type.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Type, { foreignKey: "userId" });
// Type.hasMany(User, { foreignKey: "userId" });

module.exports = Type;

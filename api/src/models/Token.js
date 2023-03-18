const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const User = require("./User.js");

const Token = sequelize.define(
	'tokens',
	{
		tokenId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

//   Token.sync({force:true})

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

// Token.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Token, { foreignKey: "userId" });
// Token.hasMany(User, { foreignKey: "userId" });
  module.exports = Token;
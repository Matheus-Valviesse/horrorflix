const Type = require("../models/Type.js");
const User = require("../models/User.js");
const validate = require("../functions/validate.js");
const { where } = require("sequelize");

const typeController = {
  create: async (req, res) => {
    const { userId: id, role: role, catalogType } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) throw new Error(`usuario precisa estar logado`);
      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      validate({ catalogType, type: `findNumero`, isRequired: true });

      const findType = await Type.findOne({ where: { type: catalogType } });

      if (findType) throw new Error(`Tipo ${catalogType} já cadastrado`);

      const type = await Type.create({
        type: catalogType,
        userId: id,
      });

      return res.status(200).json(`Tipo criado com sucesso: ${type.type}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { admId: id, role: role, typeId, catalogType } = req.body;

    try {
      validate({ typeId, isRequired: true });
      validate({ catalogType, type: `findNumero`, isRequired: true });

      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      const findType = await Type.findByPk(typeId);

      if (!findType) throw new Error(`Tipo não encontrada ou não cadastrado`);

      if (findType.type == catalogType)
        throw new Error(`Tipo não pode ser o mesmo do ja cadastrado`);

      const newType = await findType.update({
        type: catalogType,
      });

      return res.status(200).json(`Tipo alterado com sucesso: ${newType.type}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getall: async (req, res) => {
    try {
      const types = await Type.findAll();

      return res.status(200).json(types);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  getByIdentifier: async (req, res) => {
    const { userId: id, role: role } = req.body;

    try {
      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      const user = await User.findByPk(id);

      if (!user) throw new Error(`usuario precisa estar logado`);

      const types = await Type.findAll({ where: { userId: id } });

      return res.status(200).json(types);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  delete: async (req, res) => {
    const { userId: id, role: role, typeId } = req.body;

    try {
      validate({ typeId, isRequired: true });

      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      const user = await User.findByPk(id);
      if (!user) throw new Error(`usuario precisa estar logado`);

      const findType = await Type.findByPk(typeId);
      if (!findType) throw new Error(`Tipo não encontrada ou não cadastrado`);

      if (findType.userId != user.userId)
        throw new Error(`Usuario não tem direito a essa opção`);

      const destroyType = await findType.destroy();

      return res
        .status(200)
        .json(`Tipo deletado com sucesso: ${destroyType.type}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

module.exports = typeController;

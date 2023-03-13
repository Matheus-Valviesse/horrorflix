const Type = require("../models/Type.js");
const validate = require("../functions/validate.js");

const typeController = {
  create: async (req, res) => {
    const { catalogType } = req.body;

    try {
      validate({ catalogType, type: `findNumero`, isRequired: true });

      const findType = await Type.findOne({ where: { type: catalogType } });

      if (findType) throw new Error(`Tipo ${catalogType} já cadastrado`);

      const type = await Type.create({
        type: catalogType,
      });

      return res.status(200).json(`Tipo criado com sucesso: ${type.type}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { typeId, catalogType } = req.body;

    console.log(catalogType);

    try {
      validate({ typeId, isRequired: true });

      validate({ catalogType, type: `findNumero`, isRequired: true });

      const findType = await Type.findByPk(typeId);

      if (!findType)
        throw new Error(`Tipo não encontrada ou não cadastrado`);

      if (findType.type == catalogType)
        throw new Error(`Tipo não pode ser o mesmo do ja cadastrado`);

      const newType = await findType.update({
        type: catalogType,
      });

      return res
        .status(200)
        .json(`Tipo alterado com sucesso: ${newType.type}`);
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

  delete: async (req, res) => {
    const { typeId } = req.body;

    try {
      validate({ typeId, isRequired: true });

      const findType = await Type.findByPk(typeId);

      if (!findType)
        throw new Error(`Tipo não encontrada ou não cadastrado`);

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

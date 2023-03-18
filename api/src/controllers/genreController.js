const Genre = require("../models/Genre.js");
const User = require("../models/User.js");
const validate = require("../functions/validate.js");
const { where } = require("sequelize");

const typeController = {
  create: async (req, res) => {
    const { userId: id, role: role, catalogGenre } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) throw new Error(`usuario precisa estar logado`);
      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      validate({ catalogGenre, type: `findNumero`, isRequired: true });

      const findGenre = await Genre.findOne({ where: { genre: catalogGenre } });

      if (findGenre) throw new Error(`Genero ${catalogGenre} já cadastrado`);

      const genre = await Genre.create({
        genre: catalogGenre,
        userId: id,
      });

      return res.status(200).json(`Genero criado com sucesso: ${genre.genre}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { user: id, role: role, genreId, catalogGenre } = req.body;

    try {
      validate({ genreId, isRequired: true });
      validate({ catalogGenre, type: `findNumero`, isRequired: true });

      const user = await User.findByPk(id);

      if (!user) throw new Error(`usuario precisa estar logado`);

      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      const findGenre = await Genre.findByPk(genreId);

      if (!findGenre)
        throw new Error(`Genero não encontrada ou não cadastrado`);

      if (findGenre.genre == catalogGenre)
        throw new Error(`Genero não pode ser o mesmo ja cadastrado`);

      const newGenre = await findGenre.update({
        genre: catalogGenre,
      });

      console.log(newGenre);

      return res
        .status(200)
        .json(`Genero alterado com sucesso: ${newGenre.genre}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getall: async (req, res) => {
    try {
      const genres = await Genre.findAll();

      return res.status(200).json(genres);
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

      const genres = await Genre.findAll({ where: { userId: id } });

      return res.status(200).json(genres);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  delete: async (req, res) => {
    const { genreId, userId: id, role: role } = req.body;

    try {
      validate({ genreId, isRequired: true });

      const user = await User.findByPk(id);

      if (!user) throw new Error(`usuario precisa estar logado`);

      if (role !== "ADM")
        throw new Error(`Você não tem privilégio para esta área`);

      const findGenre = await Genre.findByPk(genreId);

      if (!findGenre)
        throw new Error(`Genero não encontrada ou não cadastrado`);

      const destroyGenre = await findGenre.destroy();

      return res
        .status(200)
        .json(`Genero deletado com sucesso: ${destroyGenre.genre}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

module.exports = typeController;

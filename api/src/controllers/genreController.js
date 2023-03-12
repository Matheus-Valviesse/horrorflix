const Genre = require("../models/Genre.js");
const validate = require("../functions/validate.js");

const typeController = {
  create: async (req, res) => {
    const { catalogGenre } = req.body;

    try {
      validate({ catalogGenre, type: `findNumero`, isRequired: true });

      const findGenre = await Genre.findOne({ where: { genre: catalogGenre } });

      if (findGenre) throw new Error(`Genero ${catalogGenre} já cadastrado`);

      const genre = await Genre.create({
        genre: catalogGenre,
      });

      return res.status(200).json(`Genero criado com sucesso: ${genre.genre}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { genreId, catalogGenre } = req.body;

    console.log(catalogGenre);

    try {
      validate({ genreId, isRequired: true });

      validate({ catalogGenre, type: `findNumero`, isRequired: true });

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

  delete: async (req, res) => {
    const { genreId, catalogGenre } = req.body;

    console.log(catalogGenre);

    try {
      validate({ genreId, isRequired: true });

      validate({ catalogGenre, type: `findNumero`, isRequired: true });

      const findGenre = await Genre.findByPk(genreId);

      if (!findGenre)
        throw new Error(`Genero não encontrada ou não cadastrado`);

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
};

module.exports = typeController;

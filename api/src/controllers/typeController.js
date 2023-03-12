const Type = require("../models/Type.js");

const typeController = {
  create: async (req, res) => {
    try {

      const type = await Type.create({
        type: "filme",
      });

      return res.status(200).json(`Tipo criado com sucesso: ${type.type}`);
    } catch (error) {
        
      console.log(error);
    }
  },
};

module.exports = typeController;

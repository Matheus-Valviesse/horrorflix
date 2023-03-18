const { Router } = require("express");
const genreController = require("../controllers/genreController.js");
const checkToken = require("../middleewares/checkToken.js");

const router = Router();

router.post("/genre/create", checkToken, genreController.create);
router.put("/genre/update", checkToken, genreController.update);
router.get("/genre/getall", genreController.getall);
router.get("/genre/getbyidentifier", checkToken, genreController.getByIdentifier);
router.delete("/genre/delete", checkToken, genreController.delete);

module.exports = router;

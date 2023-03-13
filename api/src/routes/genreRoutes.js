const { Router } = require("express");
const genreController = require("../controllers/genreController.js");
// const checkToken = require("../middlewares/checkToken.js");

const router = Router();

router.post("/genre/create", genreController.create);
router.put("/genre/update", genreController.update);
router.get("/genre/getall", genreController.getall);
router.delete("/genre/delete", genreController.delete);

module.exports = router;

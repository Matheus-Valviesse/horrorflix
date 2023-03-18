const { Router } = require("express");
const typeController = require("../controllers/typeController.js");
const checkToken = require("../middleewares/checkToken.js");

const router = Router();

router.post("/type/create", checkToken, typeController.create);
router.put("/type/update", checkToken, typeController.update);
router.get("/type/getall", typeController.getall);
router.get("/type/getbyidentifier", checkToken, typeController.getByIdentifier);
router.delete("/type/delete", typeController.delete);

module.exports = router;

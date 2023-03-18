const { Router } = require("express");
const userController = require("../controllers/userController.js");
const checkToken = require("../middleewares/checkToken.js");

const router = Router();

router.post("/user/create", userController.create);
router.get("/user/att/:token", userController.emailValidate);
router.get("/user/auth", userController.auth);
router.get("/user/getinfo", checkToken, userController.getInfo);
router.put("/user/update", checkToken, userController.update);
router.delete("/user/delete", checkToken, userController.delete);

module.exports = router;

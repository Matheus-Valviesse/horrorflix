const { Router } = require("express");
const typeController = require("../controllers/typeController.js");
// const checkToken = require("../middlewares/checkToken.js");
console.log('1')
const router = Router();

router.post("/type/create",  typeController.create);


module.exports = router;

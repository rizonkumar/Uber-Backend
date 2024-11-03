const exprss = require("express");

const router = exprss.Router();

router.post("/register", registerController);

router.post("/login", loginController);

module.exports = router;

const exprss = require("express");
const { register, login } = require("../controllers/authController");

const router = exprss.Router();

router.post("/register", register);

router.post("/login", login);

module.exports = router;

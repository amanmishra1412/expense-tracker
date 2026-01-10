const { signup, login } = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
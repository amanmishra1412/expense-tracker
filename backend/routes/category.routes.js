const router = require("express").Router();

const {
  addCategory,
  getCategory,
} = require("../controllers/categories.controller");

router.get("/:category", addCategory);
router.post("/:category", getCategory);

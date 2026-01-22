const router = require("express").Router();
const { deleteExpense } = require("../controllers/delete.controller");

router.delete("/:id", deleteExpense);

module.exports = router;

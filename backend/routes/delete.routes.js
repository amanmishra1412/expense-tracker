const router = require("express").router();
const { deleteExpense } = require("../controllers/delete.controller");

router.delete("/:id", deleteExpense);

module.exports = router
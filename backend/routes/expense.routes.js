const auth = require("../middleware/auth.middleware");
const router = require("express").Router();

const { addExpense, getExpense } = require("../controllers/expense.controller");

router.post("/add", auth, addExpense);
router.get("/", auth, getExpense);

module.exports = router;

const auth = require("../middleware/auth.middleware");
const router = require("express").Router();

const {
    addExpense,
    deleteExpense,
    getExpense,
    exportExpenses,
} = require("../controllers/expense.controller");

router.post("/add", auth, addExpense);
router.delete("/delete/:id", auth, deleteExpense);
router.get("/", auth, getExpense);
router.get("/export", auth, exportExpenses);

module.exports = router;

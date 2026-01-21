const auth = require("../middleware/auth.middleware");
const router = require("express").Router();

const {
    addExpense,
    deleteExpense,
    getExpense,
} = require("../controllers/expense.controller");

router.post("/add", auth, addExpense);
router.delete("/delete/:id", auth, deleteExpense);
router.get("/", auth, getExpense);

module.exports = router;

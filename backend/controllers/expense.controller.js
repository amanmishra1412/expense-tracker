const Expense = require("../models/expense.model");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user.id,
        });
        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const expense = await Expense.find({
            user: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

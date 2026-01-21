const Expense = require("../models/expense.model");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user.id,
            createdAt: date ? new Date(date) : undefined,
        });
        res.status(201).json({ message: "Success", expense: expense });
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

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: userId,
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found or not authorized",
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            id: id,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Expense = require("../model/expense.model");

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const expense = await Expense.findOneAndDelete({
      id: id,
      user: userId,
    });
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or you are not authorised",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

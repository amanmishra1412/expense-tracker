const Expense = require("../model/expense.model");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      user: req.user.id,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpense = async () => {
  try{
     const expense = await Expense.find({
    user: req.user.id,
  }).sort({
    createdAt: -1,
  });

  res.json(expense)
  } catch(err){
    res.status(500).json({message: err.message})
  }
 
};

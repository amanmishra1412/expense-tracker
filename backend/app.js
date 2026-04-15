const express = require("express");
const { PORT } = require("./config/env");
const app = express();
const { connectDB } = require("./config/db");
const cors = require("cors");
app.use(cors());

const authRoute = require("./routes/auth.routes");
const expenseRoutes = require("./routes/expense.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/Auth", authRoute);
app.use("/expense", expenseRoutes);

app.get("/", (req, res) => {
  res.send("i am the dashboard");
});

app.listen(PORT);

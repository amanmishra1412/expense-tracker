const express = require("express");
const app = express();
const { connectDB } = require("./config/db");

const authRoute = require("./routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/Auth", authRoute);

app.get("/", (req, res) => {
  res.send("i am the dashboard");
});

app.listen(3000);

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  let exist = await User.findOne({ email });
  if (exist) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({ message: "Signup success", token });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = User.findOne({ email });
    if (!find) {
      return res.status(400).json({
        message: "User not found ",
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "wrong credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).jon(
      {
        message: "Login success",
      },
      token
    );
  } catch (error){
    res.status({
        message : error.message
    })
  }
};

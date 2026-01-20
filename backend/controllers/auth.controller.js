const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required",
            });
        }
        let exist = await User.findOne({ email });
        if (exist) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Signup success" });
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body)
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found ",
            });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({
                message: "wrong credentials",
            });
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // console.log(token);

        res.status(200).json({
            message: "Login success",
            token,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

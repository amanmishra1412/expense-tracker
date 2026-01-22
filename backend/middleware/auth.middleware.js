const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
<<<<<<< HEAD
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
=======
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: `Invalid token ${err} ` });
>>>>>>> 930ddc8c152178e294c4364ef0e7ea45ecb45d30
    }
};

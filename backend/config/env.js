const dotenv = require("dotenv");
dotenv.config();

const { PORT, MONGO_URI, JWT_SECRET } = process.env;

// if (!MONGO_URI || !JWT_SECRET) {
//   throw new Error('Missing required ENV variables');
// }

module.exports = {
    PORT,
    MONGO_URI,
    JWT_SECRET,
};

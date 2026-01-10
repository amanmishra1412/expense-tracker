const express = require("express");
const { generatePdf } = require("../controllers/pdf.controller");

const router = express.Router();

router.get("/invoice", generatePdf);

module.exports = router;

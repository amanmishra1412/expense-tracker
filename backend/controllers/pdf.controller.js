const { createPdf } = require("../services/pdf.service");

const generatePdf = async (req, res) => {
    try {
        const pdfBuffer = await createPdf();

        res.setHeader("Content-Type", "application/pdf");

        // 👇 IMPORTANT CHANGE
        res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");

        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("PDF generation failed");
    }
};

module.exports = { generatePdf };

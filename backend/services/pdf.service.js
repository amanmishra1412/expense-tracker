const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const createPdf = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // HTML template read karo
    const htmlPath = path.resolve("templates/invoice.html");
    const html = fs.readFileSync(htmlPath, "utf-8");

    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm",
        },
    });

    await browser.close();

    return pdfBuffer;
};

module.exports = { createPdf };

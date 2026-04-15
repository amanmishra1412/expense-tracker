const Expense = require("../models/expense.model");
const ExcelJS = require("exceljs");
const puppeteer = require("puppeteer-core");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user.id,
            createdAt: date ? new Date(date) : undefined,
        });
        res.status(201).json({ message: "Success", expense: expense });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const expense = await Expense.find({
            user: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: userId,
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found or not authorized",
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            id: id,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportExpenses = async (req, res) => {
    try {
        const { fromDate, toDate, category } = req.query;

        let filter = { user: req.user.id };

        // Date filter
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        // Excel start
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Expenses");

        worksheet.columns = [
            { header: "S.No", key: "sno", width: 8 },
            { header: "Title", key: "title", width: 25 },
            { header: "Category", key: "category", width: 15 },
            { header: "Date", key: "date", width: 15 },
            { header: "Amount", key: "amount", width: 12 },
        ];

        let totalAmount = 0;

        expenses.forEach((exp, index) => {
            totalAmount += exp.amount;

            worksheet.addRow({
                sno: index + 1,
                title: exp.title,
                category: exp.category,
                date: exp.createdAt,
                amount: exp.amount,
            });
        });

        // Styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getColumn("date").numFmt = "dd-mm-yyyy";

        // 👉 Total Row
        const totalRow = worksheet.addRow({
            title: "Total",
            amount: totalAmount,
        });

        totalRow.font = { bold: true };

        // Merge cells for better UI (Title → Category → Date)
        worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);

        // Right align total amount
        totalRow.getCell("E").alignment = { horizontal: "right" };

        // Response
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expenses.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportExpensesPDF = async (req, res) => {
    let browser;

    try {
        const { fromDate, toDate, category } = req.query;

        let filter = { user: req.user.id };

        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }

        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        let totalAmount = 0;

        const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background: #f3f4f6; }
                .amount { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Expense Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenses.map((exp, i) => {
            totalAmount += exp.amount;
            return `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${exp.title}</td>
                                <td>${exp.category}</td>
                                <td>${new Date(exp.createdAt).toLocaleDateString("en-GB")}</td>
                                <td class="amount">₹ ${exp.amount}</td>
                            </tr>
                        `;
        }).join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align:right;"><b>Total</b></td>
                        <td class="amount">₹ ${totalAmount}</td>
                    </tr>
                </tfoot>
            </table>
        </body>
        </html>
        `;
        const isProduction = process.env.NODE_ENV === "production";

        if (isProduction) {
            // 🔥 Render / Linux
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: true,
            });
        } else {
            // 💻 Local Windows
            browser = await puppeteer.launch({
                executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                headless: "new",
            });
        }

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expenses.pdf"
        );

        res.status(200).end(pdfBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    } finally {
        if (browser) await browser.close();
    }
};
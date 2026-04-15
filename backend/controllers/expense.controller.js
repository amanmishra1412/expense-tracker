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

        // 👉 HTML Template (Tailwind style)
        const html = `
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 p-6">
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

                <h1 class="text-2xl font-bold mb-4">Expense Report</h1>

                <table class="w-full text-sm border">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-2 text-left">S.No</th>
                            <th class="p-2 text-left">Title</th>
                            <th class="p-2 text-left">Category</th>
                            <th class="p-2 text-left">Date</th>
                            <th class="p-2 text-left">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${expenses.map((exp, i) => {
            totalAmount += exp.amount;
            return `
                                <tr class="border-t">
                                    <td class="p-2">${i + 1}</td>
                                    <td class="p-2">${exp.title}</td>
                                    <td class="p-2">${exp.category}</td>
                                    <td class="p-2">${new Date(exp.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td class="p-2 text-red-600 font-semibold">₹ ${exp.amount}</td>
                                </tr>
                            `;
        }).join("")}
                    </tbody>

                    <tfoot>
                        <tr class="bg-gray-100 font-bold border-t">
                            <td colspan="4" class="p-2 text-right">Total</td>
                            <td class="p-2 text-red-600">₹ ${totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </body>
        </html>
        `;

        // Puppeteer launch

        const browser = await puppeteer.launch({
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless: "new",
        });


        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        // Response
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=expenses.pdf",
        });

        res.send(pdfBuffer);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
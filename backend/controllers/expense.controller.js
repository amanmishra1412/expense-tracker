const Expense = require("../models/expense.model");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, date, type } = req.body;

        const expense = await Expense.create({
            title,
            amount: Number(amount),
            category,
            type: type || "expense",
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
        const { fromDate, toDate, category, type } = req.query;

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

        // Type filter
        if (type) {
            filter.type = type;
        }

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        // Excel start
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Financial Statement");

        worksheet.columns = [
            { header: "S.No", key: "sno", width: 8 },
            { header: "Title", key: "title", width: 25 },
            { header: "Type", key: "type", width: 12 },
            { header: "Category", key: "category", width: 15 },
            { header: "Date", key: "date", width: 15 },
            { header: "Amount (₹)", key: "amount", width: 15 },
        ];

        let totalIncome = 0;
        let totalExpense = 0;

        expenses.forEach((exp, index) => {
            const itemType = exp.type || "expense";
            if (itemType === "income") {
                totalIncome += exp.amount;
            } else {
                totalExpense += exp.amount;
            }

            const row = worksheet.addRow({
                sno: index + 1,
                title: exp.title,
                type: itemType.toUpperCase(),
                category: exp.category,
                date: exp.createdAt,
                amount: itemType === "income" ? exp.amount : -exp.amount,
            });

            if (itemType === "income") {
                row.getCell("type").font = { color: { argb: "FF16A34A" }, bold: true };
                row.getCell("amount").font = { color: { argb: "FF16A34A" }, bold: true };
            } else {
                row.getCell("type").font = { color: { argb: "FFDC2626" }, bold: true };
                row.getCell("amount").font = { color: { argb: "FFDC2626" }, bold: true };
            }
        });

        // Styling Header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getColumn("date").numFmt = "dd-mm-yyyy";

        worksheet.addRow({}); // empty separator row

        // 👉 Total Rows
        const incomeRow = worksheet.addRow({
            title: "Total Income",
            amount: totalIncome,
        });
        incomeRow.font = { bold: true, color: { argb: "FF16A34A" } };
        worksheet.mergeCells(`A${incomeRow.number}:E${incomeRow.number}`);
        incomeRow.getCell("F").alignment = { horizontal: "right" };

        const expenseRow = worksheet.addRow({
            title: "Total Expense",
            amount: totalExpense,
        });
        expenseRow.font = { bold: true, color: { argb: "FFDC2626" } };
        worksheet.mergeCells(`A${expenseRow.number}:E${expenseRow.number}`);
        expenseRow.getCell("F").alignment = { horizontal: "right" };

        const netBalance = totalIncome - totalExpense;
        const netRow = worksheet.addRow({
            title: "Net Balance",
            amount: netBalance,
        });
        netRow.font = { bold: true };
        worksheet.mergeCells(`A${netRow.number}:E${netRow.number}`);
        netRow.getCell("F").alignment = { horizontal: "right" };

        // Response
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=financial_statement.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportExpensesPDF = async (req, res) => {
    try {
        const { fromDate, toDate, category, type } = req.query;

        let filter = { user: req.user.id };

        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }

        if (category) filter.category = category;
        if (type) filter.type = type;

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
            bufferPages: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=financial_report.pdf"
        );

        doc.pipe(res);

        // ================= HEADER =================
        doc
            .fillColor("#1e293b")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text("FINANCIAL STATEMENT REPORT", { align: "center" });

        doc
            .moveDown(0.2)
            .fillColor("#64748b")
            .fontSize(10)
            .font("Helvetica")
            .text(
                `Period: ${fromDate || "Initial"} to ${toDate || "Present"}`,
                { align: "center" }
            )
            .text(`Filter: ${type ? type.toUpperCase() : "ALL"} | Category: ${category || "All"}`, {
                align: "center",
            });

        doc.moveTo(50, 130)
            .lineTo(545, 130)
            .strokeColor("#cbd5e1")
            .lineWidth(1)
            .stroke();

        // ================= TABLE =================
        const tableTop = 150;
        const rowHeight = 28;

        const colWidths = {
            sno: 30,
            title: 150,
            type: 65,
            category: 95,
            date: 75,
            amount: 80,
        };

        const colX = {
            sno: 50,
            title: 80,
            type: 230,
            category: 295,
            date: 390,
            amount: 465,
        };

        let y = tableTop;

        // ===== HEADER ROW =====
        doc.rect(50, y, 495, rowHeight).fill("#1e293b");

        doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);

        doc.text("ID", colX.sno, y + 9, { width: colWidths.sno, align: "center" });
        doc.text("TITLE", colX.title, y + 9, { width: colWidths.title, align: "center" });
        doc.text("TYPE", colX.type, y + 9, { width: colWidths.type, align: "center" });
        doc.text("CATEGORY", colX.category, y + 9, { width: colWidths.category, align: "center" });
        doc.text("DATE", colX.date, y + 9, { width: colWidths.date, align: "center" });
        doc.text("AMOUNT (₹)", colX.amount, y + 9, { width: colWidths.amount, align: "center" });

        y += rowHeight;

        let totalIncome = 0;
        let totalExpense = 0;

        // ===== ROWS =====
        doc.font("Helvetica").fontSize(9);

        expenses.forEach((exp, i) => {
            const itemType = exp.type || "expense";
            if (itemType === "income") {
                totalIncome += exp.amount;
            } else {
                totalExpense += exp.amount;
            }

            // PAGE BREAK FIX
            if (y + rowHeight > doc.page.height - 120) {
                doc.addPage();
                y = 50;
            }

            // Alternate row background
            if (i % 2 !== 0) {
                doc.rect(50, y, 495, rowHeight).fill("#f8fafc");
            }

            doc.fillColor("#334155");

            doc.text(i + 1, colX.sno, y + 8, { width: colWidths.sno, align: "center" });
            doc.text(exp.title, colX.title, y + 8, {
                width: colWidths.title,
                align: "center",
                ellipsis: true,
            });

            // Type text & color
            const isIncome = itemType === "income";
            doc.fillColor(isIncome ? "#16a34a" : "#dc2626").font("Helvetica-Bold");
            doc.text(itemType.toUpperCase(), colX.type, y + 8, {
                width: colWidths.type,
                align: "center",
            });

            doc.fillColor("#334155").font("Helvetica");
            doc.text(exp.category, colX.category, y + 8, {
                width: colWidths.category,
                align: "center",
            });
            doc.text(
                new Date(exp.createdAt).toLocaleDateString("en-GB"),
                colX.date,
                y + 8,
                { width: colWidths.date, align: "center" }
            );

            // Amount text & color
            doc.fillColor(isIncome ? "#16a34a" : "#dc2626").font("Helvetica-Bold");
            doc.text(
                `${isIncome ? "+" : "-"}${exp.amount.toLocaleString()}`,
                colX.amount,
                y + 8,
                { width: colWidths.amount, align: "center" }
            );

            doc.font("Helvetica");
            y += rowHeight;
        });

        // ================= SUMMARY BOX =================
        if (y + 90 > doc.page.height - 50) {
            doc.addPage();
            y = 50;
        }

        y += 10;
        const netBalance = totalIncome - totalExpense;

        doc.rect(50, y, 495, 75).fill("#f1f5f9");

        doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(11);
        doc.text("FINANCIAL SUMMARY", 65, y + 12);

        doc.fontSize(10);
        doc.fillColor("#16a34a").text(`Total Income: ₹ ${totalIncome.toLocaleString()}`, 65, y + 35);
        doc.fillColor("#dc2626").text(`Total Expense: ₹ ${totalExpense.toLocaleString()}`, 230, y + 35);
        doc.fillColor(netBalance >= 0 ? "#16a34a" : "#dc2626").text(`Net Balance: ₹ ${netBalance.toLocaleString()}`, 400, y + 35);

        // ================= FOOTER =================
        const pages = doc.bufferedPageRange();

        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);

            const footerY = doc.page.height - 40;

            doc.fillColor("#94a3b8").fontSize(8).text(
                `Generated on ${new Date().toLocaleString()}  |  Page ${i + 1} of ${pages.count}`,
                0,
                footerY,
                { align: "center", width: doc.page.width }
            );
        }

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating PDF" });
    }
};
const Expense = require("../models/expense.model");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

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
        if (category) filter.category = category;

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        const doc = new PDFDocument({ 
            margin: 50, 
            size: "A4",
            bufferPages: true 
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=expenses_report.pdf");
        doc.pipe(res);

        // --- Header Section ---
        // Align: center use kiya gaya hai
        doc.fillColor("#1e293b").fontSize(24).font("Helvetica-Bold").text("EXPENSE REPORT", { align: "center" });
        
        doc.moveDown(0.2);
        doc.fillColor("#64748b").fontSize(10).font("Helvetica").text(`Report Period: ${fromDate || "Initial"} to ${toDate || "Present"}`, { align: "center" });
        doc.text(`Category: ${category || "All Categories"}`, { align: "center" });
        
        doc.moveTo(50, 130).lineTo(545, 130).strokeColor("#cbd5e1").lineWidth(1).stroke();
        doc.moveDown(3);

        // --- Table Constants (Widths define ki gayi hain centering ke liye) ---
        const tableTop = 160;
        const rowHeight = 30;
        const colWidths = { sno: 40, title: 180, category: 100, date: 90, amount: 85 };
        const colX = {
            sno: 50,
            title: 90,
            category: 270,
            date: 370,
            amount: 460
        };

        let y = tableTop;

        // --- Table Header ---
        doc.rect(50, y, 495, rowHeight).fill("#1e293b"); 
        doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
        
        // Har text field mein { width: X, align: 'center' } lagaya gaya hai
        doc.text("ID", colX.sno, y + 10, { width: colWidths.sno, align: 'center' });
        doc.text("DESCRIPTION", colX.title, y + 10, { width: colWidths.title, align: 'center' });
        doc.text("CATEGORY", colX.category, y + 10, { width: colWidths.category, align: 'center' });
        doc.text("DATE", colX.date, y + 10, { width: colWidths.date, align: 'center' });
        doc.text("AMOUNT", colX.amount, y + 10, { width: colWidths.amount, align: 'center' });

        y += rowHeight;
        let totalAmount = 0;

        // --- Table Rows ---
        doc.font("Helvetica").fontSize(10);
        
        expenses.forEach((exp, i) => {
            totalAmount += exp.amount;

            if (i % 2 !== 0) {
                doc.rect(50, y, 495, rowHeight).fill("#f8fafc");
            }

            doc.fillColor("#334155");
            doc.text(i + 1, colX.sno, y + 10, { width: colWidths.sno, align: 'center' });
            doc.text(exp.title, colX.title, y + 10, { width: colWidths.title, align: 'center', ellipsis: true });
            doc.text(exp.category, colX.category, y + 10, { width: colWidths.category, align: 'center' });
            doc.text(new Date(exp.createdAt).toLocaleDateString("en-GB"), colX.date, y + 10, { width: colWidths.date, align: 'center' });
            
            doc.fillColor("#000000").font("Helvetica-Bold")
               .text(`₹${exp.amount.toLocaleString()}`, colX.amount, y + 10, { width: colWidths.amount, align: 'center' });
            
            doc.font("Helvetica");
            y += rowHeight;

            if (y > 730) {
                doc.addPage();
                y = 50;
            }
        });

        // --- Summary Row (Centered under Amount column) ---
        doc.moveDown(1);
        y = doc.y;

        doc.rect(370, y, 175, rowHeight).fill("#f1f5f9");
        doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(11);
        doc.text("TOTAL:", 370, y + 10, { width: 90, align: 'right' }); 
        doc.fillColor("#dc2626").text(`₹${totalAmount.toLocaleString()}`, colX.amount, y + 10, { width: colWidths.amount, align: 'center' });

        // --- Footer ---
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fillColor("#94a3b8").fontSize(8)
               .text(`Generated on ${new Date().toLocaleString()}  |  Page ${i + 1} of ${pages.count}`, 
               0, 800, { align: "center", width: doc.page.width });
        }

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating PDF" });
    }
};
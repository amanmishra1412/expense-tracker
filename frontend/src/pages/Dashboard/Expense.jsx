import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ExpenseData } from "../../context/ExpenseContext";
import { AuthData } from "../../context/AuthContext";

const Expense = () => {
    const { expenses, setExpenses } = useContext(ExpenseData);
    const { user } = useContext(AuthData);
    const [loadingPDF, setLoadingPDF] = useState(false);

    const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

    const getMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const format = (date) =>
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

        return {
            start: format(start),
            end: format(end),
        };
    };

    const { start, end } = getMonthRange();

    const [fromDate, setFromDate] = useState(start);
    const [toDate, setToDate] = useState(end);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const toTimestamp = (date) => {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    const filteredExpenses = expenses.filter((item) => {
        const matchCategory =
            !categoryFilter || item.category === categoryFilter;

        const itemType = item.type || "expense";
        const matchType = !typeFilter || itemType === typeFilter;

        const itemDate = toTimestamp(item.createdAt);
        const from = fromDate ? toTimestamp(fromDate) : null;
        const to = toDate ? toTimestamp(toDate) : null;

        const matchFrom = !from || itemDate >= from;
        const matchTo = !to || itemDate <= to;

        return matchCategory && matchType && matchFrom && matchTo;
    });

    let totalIncome = 0;
    let totalExpense = 0;

    filteredExpenses.forEach((item) => {
        if (item.type === "income") {
            totalIncome += Number(item.amount);
        } else {
            totalExpense += Number(item.amount);
        }
    });

    const netBalance = totalIncome - totalExpense;

    const deleteExpense = async (id) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_URI}/expense/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            setExpenses((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const downloadExcel = async () => {
        try {
            const query = new URLSearchParams({
                fromDate,
                toDate,
                category: categoryFilter,
                type: typeFilter,
            });

            const response = await fetch(
                `${import.meta.env.VITE_URI}/expense/export?${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "financial_statement.xlsx";
            a.click();
        } catch (err) {
            console.log(err);
        }
    };

    const downloadPDF = async () => {
        try {
            setLoadingPDF(true);

            const query = new URLSearchParams({
                fromDate,
                toDate,
                category: categoryFilter,
                type: typeFilter,
            });

            const response = await fetch(
                `${import.meta.env.VITE_URI}/expense/export-pdf?${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "financial_report.pdf";
            a.click();
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingPDF(false);
        }
    };

    return (
        <div className="bg-main min-h-screen p-3 sm:p-5">
            <div className="max-w-6xl mx-auto bg-card rounded-xl shadow-md p-4 sm:p-5 flex flex-col">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-dark">
                        Transactions & Statement
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {/* Type Filter */}
                        <select
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm bg-white"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="income">Income Only 💰</option>
                            <option value="expense">Expense Only 💸</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm bg-white"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Business">Business</option>
                            <option value="Investment">Investment</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Rent">Rent</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Date Filters */}
                        <input
                            type="date"
                            value={fromDate}
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm bg-white"
                            onChange={(e) => setFromDate(e.target.value)}
                        />

                        <input
                            type="date"
                            value={toDate}
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm bg-white"
                            onChange={(e) => setToDate(e.target.value)}
                        />

                        {/* Export Buttons */}
                        <button
                            onClick={downloadExcel}
                            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                            Excel Export
                        </button>
                        <button
                            onClick={downloadPDF}
                            disabled={loadingPDF}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm text-white font-medium flex items-center justify-center gap-2 ${
                                loadingPDF ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 transition"
                            }`}
                        >
                            {loadingPDF ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Generating...
                                </>
                            ) : (
                                "PDF Export"
                            )}
                        </button>

                        <Link
                            to="/addexpense"
                            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg text-sm text-center font-medium shadow"
                        >
                            + Add Record
                        </Link>
                    </div>
                </div>

                {/* SUMMARY STATS BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 p-4 bg-gray-50 rounded-xl border">
                    <div className="text-center sm:text-left">
                        <span className="text-xs text-gray-500 block">Total Income</span>
                        <span className="text-lg font-bold text-green-600">+ ₹ {totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <span className="text-xs text-gray-500 block">Total Expense</span>
                        <span className="text-lg font-bold text-red-600">- ₹ {totalExpense.toLocaleString()}</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <span className="text-xs text-gray-500 block">Net Balance</span>
                        <span className={`text-lg font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ₹ {netBalance.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* ================= MOBILE CARD VIEW ================= */}
                <div className="sm:hidden space-y-3 mt-2">
                    {filteredExpenses.length === 0 && (
                        <p className="text-center text-gray-400 py-6">
                            No records found
                        </p>
                    )}

                    {filteredExpenses.map((item) => {
                        const isIncome = item.type === "income";
                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-sm p-4 border"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    isIncome
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isIncome ? "INCOME" : "EXPENSE"}
                                            </span>
                                            <h3 className="font-semibold text-dark capitalize">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(item.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`font-bold text-base ${
                                            isIncome ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {isIncome ? "+" : "-"} ₹ {Number(item.amount).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {item.category || "General"}
                                    </span>

                                    <button
                                        onClick={() => deleteExpense(item._id)}
                                        className="text-xs text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden sm:block mt-2 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b text-gray-500 bg-gray-50">
                            <tr>
                                <th className="py-3 px-3 text-left">Title</th>
                                <th className="py-3 px-3 text-left">Type</th>
                                <th className="py-3 px-3 text-left">Category</th>
                                <th className="py-3 px-3 text-left">Date</th>
                                <th className="py-3 px-3 text-left">Amount</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredExpenses.map((item) => {
                                const isIncome = item.type === "income";
                                return (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-3 capitalize font-medium text-dark">
                                            {item.title}
                                        </td>

                                        <td className="py-3 px-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                    isIncome
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isIncome ? "INCOME" : "EXPENSE"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {item.category || "General"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3 text-gray-500">
                                            {formatDate(item.createdAt)}
                                        </td>

                                        <td
                                            className={`py-3 px-3 font-bold text-base ${
                                                isIncome ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            {isIncome ? "+" : "-"} ₹ {Number(item.amount).toLocaleString()}
                                        </td>

                                        <td className="py-3 px-3 text-right">
                                            <button
                                                onClick={() => deleteExpense(item._id)}
                                                className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-xs hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-10 text-center text-gray-400"
                                    >
                                        No records found matching filters
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {/* ✅ SUMMARY ROW */}
                        {filteredExpenses.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-bold border-t">
                                    <td colSpan="4" className="py-3 px-3 text-right text-dark">
                                        Summary Total
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="text-xs text-green-700">Income: +₹{totalIncome.toLocaleString()}</div>
                                        <div className="text-xs text-red-700">Expense: -₹{totalExpense.toLocaleString()}</div>
                                        <div className={`text-sm ${netBalance >= 0 ? "text-green-700" : "text-red-700"}`}>
                                            Net: ₹{netBalance.toLocaleString()}
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expense;

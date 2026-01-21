import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ExpenseData } from "../../context/ExpenseContext";
import { AuthData } from "../../context/AuthContext";

const Expense = () => {
    const { expenses, setExpenses } = useContext(ExpenseData);
    const { user } = useContext(AuthData);

    const [categoryFilter, setCategoryFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filteredExpenses = expenses.filter((item) => {
        const matchCategory =
            !categoryFilter || item.category === categoryFilter;

        const itemDate = new Date(item.date);

        const matchFrom = !fromDate || itemDate >= new Date(fromDate);

        const matchTo = !toDate || itemDate <= new Date(toDate);

        return matchCategory && matchFrom && matchTo;
    });
    // console.log(filteredExpenses);

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

    const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");
    return (
        <div className="bg-main min-h-screen p-3 sm:p-5">
            <div className="max-w-6xl mx-auto bg-card rounded-xl shadow-md p-4 sm:p-5 flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-dark">
                        Expenses
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        <select
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Rent">Rent</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                        </select>

                        <input
                            type="date"
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm"
                            onChange={(e) => setFromDate(e.target.value)}
                        />

                        <input
                            type="date"
                            className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm"
                            onChange={(e) => setToDate(e.target.value)}
                        />

                        <Link
                            to="/addexpense"
                            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg text-sm text-center"
                        >
                            + Add Expense
                        </Link>
                    </div>
                </div>

                {/* ================= MOBILE CARD VIEW ================= */}
                <div className="sm:hidden space-y-3">
                    {filteredExpenses.length === 0 && (
                        <p className="text-center text-gray-400 py-6">
                            No expenses found
                        </p>
                    )}

                    {filteredExpenses.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-lg shadow-sm p-4 border"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-dark capitalize">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </div>

                                <span className="text-red-600 font-semibold">
                                    ₹ {item.amount}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <span className="bg-accent-soft text-(--accent) px-3 py-1 rounded-full text-xs">
                                    {item.category}
                                </span>

                                <button
                                    onClick={() => deleteExpense(item._id)}
                                    className="text-xs text-red-500 border border-red-500 px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden sm:block mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b text-gray-500">
                            <tr>
                                <th className="py-3 px-2 text-left">Title</th>
                                <th className="py-3 px-2 text-left">
                                    Category
                                </th>
                                <th className="py-3 px-2 text-left">Date</th>
                                <th className="py-3 px-2 text-left">Amount</th>
                                <th className="py-3 px-2 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredExpenses.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-2 capitalize font-medium">
                                        {item.title}
                                    </td>

                                    <td className="py-3 px-2">
                                        <span className="bg-accent-soft text-(--accent) px-3 py-1 rounded-full text-xs">
                                            {item.category}
                                        </span>
                                    </td>

                                    <td className="py-3 px-2 text-gray-500">
                                        {formatDate(item.createdAt)}
                                    </td>

                                    <td className="py-3 px-2 font-semibold text-red-600">
                                        ₹ {item.amount}
                                    </td>

                                    <td className="py-3 px-2 text-right">
                                        <button
                                            onClick={() =>
                                                deleteExpense(item._id)
                                            }
                                            className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-10 text-center text-gray-400"
                                    >
                                        No expenses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expense;

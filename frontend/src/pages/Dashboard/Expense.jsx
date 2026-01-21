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

    return (
        <div className="bg-main">
            <div className="max-w-5xl mx-auto bg-card rounded-xl shadow-md p-5 h-[85vh] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Left: Title */}
                    <h2 className="text-2xl font-semibold text-dark">
                        Expenses
                    </h2>

                    {/* Right: Filters + Button */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category Filter */}
                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) "
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Rent">Rent</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                        </select>

                        {/* From Date */}
                        <input
                            type="date"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                            onChange={(e) => setFromDate(e.target.value)}
                        />

                        {/* To Date */}
                        <input
                            type="date"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) "
                            onChange={(e) => setToDate(e.target.value)}
                        />

                        {/* Add Button */}
                        <Link
                            to="/addexpense"
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                        >
                            + Add Expense
                        </Link>
                    </div>
                </div>

                {/* Table Wrapper */}
                <div className="mt-4 flex-1 overflow-hidden">
                    {/* Table */}
                    <div className="relative h-full overflow-y-auto">
                        <table className="min-w-full text-sm">
                            {/* Table Head */}
                            <thead className="sticky top-0 bg-card z-10 border-b">
                                <tr className="text-left text-gray-500 font-medium">
                                    <th className="py-3 px-2">Title</th>
                                    <th className="py-3 px-2">Category</th>
                                    <th className="py-3 px-2">Date</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y">
                                {filteredExpenses.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        {/* Title */}
                                        <td className="py-3 px-2 capitalize text-dark font-medium">
                                            {item.title}
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-2">
                                            <span className="bg-accent-soft text-(--accent) px-3 py-1 rounded-full text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 px-2 text-gray-500">
                                            {new Date(
                                                item.createdAt,
                                            ).toLocaleDateString("en-GB")}{" "}
                                        </td>

                                        {/* Amount */}
                                        <td className="py-3 px-2 font-semibold text-red-600">
                                            ₹ {item.amount}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-2 text-right">
                                            <button
                                                onClick={() =>
                                                    deleteExpense(item._id)
                                                }
                                                className="px-3 py-1 rounded-md border border-red-500 text-red-500 text-xs hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Empty State */}
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
        </div>
    );
};

export default Expense;

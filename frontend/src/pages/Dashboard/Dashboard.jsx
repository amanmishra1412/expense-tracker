import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ExpenseData } from "../../context/ExpenseContext";

const Dashboard = () => {
    const { expenses } = useContext(ExpenseData);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ================== CALCULATIONS ==================

    // Total Income & Expense
    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((e) => {
        const isIncome = e.type === "income";
        if (isIncome) {
            totalIncome += Number(e.amount);
        } else {
            totalExpense += Number(e.amount);
        }
    });

    const netBalance = totalIncome - totalExpense;

    // This Month Income & Expense
    let monthIncome = 0;
    let monthExpense = 0;

    expenses.forEach((e) => {
        const d = new Date(e.createdAt);
        if (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        ) {
            if (e.type === "income") {
                monthIncome += Number(e.amount);
            } else {
                monthExpense += Number(e.amount);
            }
        }
    });

    // Recent Transactions (last 5)
    const recentTransactions = [...expenses]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // ================== UI ==================
    return (
        <div className="min-h-screen bg-main p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-dark">
                            Financial Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Track your income, expenses & net balance
                        </p>
                    </div>

                    <Link
                        to="/addexpense"
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-center font-medium shadow hover:opacity-90 transition"
                    >
                        + Add Income / Expense
                    </Link>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        title="Net Balance"
                        value={`₹ ${netBalance.toLocaleString()}`}
                        valueColor={netBalance >= 0 ? "text-green-600" : "text-red-600"}
                        subtitle="Total Income - Total Expense"
                    />

                    <Card
                        title="Total Income"
                        value={`+ ₹ ${totalIncome.toLocaleString()}`}
                        valueColor="text-green-600"
                        subtitle="Total earnings recorded"
                    />

                    <Card
                        title="Total Expense"
                        value={`- ₹ ${totalExpense.toLocaleString()}`}
                        valueColor="text-red-600"
                        subtitle="Total spending recorded"
                    />

                    <Card
                        title="This Month"
                        value={`₹ ${(monthIncome - monthExpense).toLocaleString()}`}
                        subtitle={`In: +₹${monthIncome.toLocaleString()} | Out: -₹${monthExpense.toLocaleString()}`}
                    />
                </div>

                {/* RECENT TRANSACTIONS */}
                <div className="bg-card rounded-xl shadow p-5 border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-dark">
                            Recent Transactions
                        </h3>
                        <Link
                            to="/expense"
                            className="text-sm text-blue-600 hover:underline font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-400 text-sm py-4 text-center">
                            No transactions recorded yet
                        </p>
                    ) : (
                        <div className="divide-y">
                            {recentTransactions.map((e) => {
                                const isIncome = e.type === "income";
                                return (
                                    <div
                                        key={e._id}
                                        className="flex justify-between items-center py-3 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                                    isIncome
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isIncome ? "IN" : "OUT"}
                                            </div>
                                            <div>
                                                <p className="text-dark capitalize font-semibold">
                                                    {e.title}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {e.category || "General"} •{" "}
                                                    {new Date(e.createdAt).toLocaleDateString("en-GB")}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`font-bold text-base ${
                                                isIncome ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            {isIncome ? "+" : "-"} ₹ {Number(e.amount).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, subtitle, valueColor = "text-dark" }) => (
    <div className="bg-card rounded-xl shadow p-5 border">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h2 className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
);

export default Dashboard;

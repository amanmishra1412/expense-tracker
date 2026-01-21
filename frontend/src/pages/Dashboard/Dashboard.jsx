import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ExpenseData } from "../../context/ExpenseContext";

const Dashboard = () => {
    const { expenses } = useContext(ExpenseData);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ================== CALCULATIONS ==================

    // Today Expense
    const todayExpense = expenses
        .filter((e) => new Date(e.createdAt) >= today)
        .reduce((sum, e) => sum + e.amount, 0);

    // This Month Expense
    const monthExpense = expenses
        .filter((e) => {
            const d = new Date(e.createdAt);
            return (
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear()
            );
        })
        .reduce((sum, e) => sum + e.amount, 0);

    // Category totals
    const categoryTotals = {};
    expenses.forEach((e) => {
        categoryTotals[e.category] =
            (categoryTotals[e.category] || 0) + e.amount;
    });

    // Top Category
    const topCategory =
        Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "—";

    // Recent Expenses (last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // ================== UI ==================
    return (
        <div className="min-h-screen bg-main p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold text-dark">
                    Expense Dashboard
                </h1>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card title="Today’s Expense" value={`₹ ${todayExpense}`} />
                    <Card
                        title="This Month"
                        value={`₹ ${monthExpense}`}
                        subtitle={today.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    />
                    <Card title="Top Category" value={topCategory} />
                    <Card title="Total Entries" value={expenses.length} />
                </div>

                {/* RECENT EXPENSES */}
                <div className="bg-card rounded-xl shadow p-5">
                    <div className="flex justify-between mb-3">
                        <h3 className="text-lg font-semibold text-dark">
                            Recent Expenses
                        </h3>
                        <Link
                            to="/expense"
                            className="text-sm text-(--accent)"
                        >
                            View All
                        </Link>
                    </div>

                    {recentExpenses.length === 0 ? (
                        <p className="text-gray-400 text-sm">No expenses yet</p>
                    ) : (
                        <div className="divide-y">
                            {recentExpenses.map((e) => (
                                <div
                                    key={e._id}
                                    className="flex justify-between py-3 text-sm"
                                >
                                    <div>
                                        <p className="text-dark capitalize font-medium">
                                            {e.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {e.category}
                                        </p>
                                    </div>
                                    <div className="text-red-600 font-semibold">
                                        ₹ {e.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                    <Link
                        to="/addexpense"
                        className="bg-primary text-white px-6 py-3 rounded-xl"
                    >
                        + Add Expense
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, subtitle }) => (
    <div className="bg-card rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold mt-1 text-dark">{value}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

export default Dashboard;

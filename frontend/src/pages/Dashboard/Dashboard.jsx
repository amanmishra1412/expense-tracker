import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-main p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-dark">
          Expense Dashboard
        </h1>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Today Expense */}
          <div className="bg-card rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Today’s Expense</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">
              ₹ 850
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Updated today
            </p>
          </div>

          {/* Monthly Expense */}
          <div className="bg-card rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">This Month</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">
              ₹ 18,450
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              January 2026
            </p>
          </div>

          {/* Top Category */}
          <div className="bg-card rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Top Category</p>
            <h2 className="text-xl font-semibold text-dark mt-1">
              Food
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Highest spending
            </p>
          </div>

          {/* Total Entries */}
          <div className="bg-card rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Total Entries</p>
            <h2 className="text-2xl font-bold text-dark mt-1">
              124
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Till now
            </p>
          </div>
        </div>

        {/* ================= CHART SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Category Chart */}
          <div className="bg-card rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-dark mb-3">
              Category Breakdown
            </h3>
            <div className="h-56 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
              Pie Chart Here
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-dark mb-3">
              Last 7 Days Expense
            </h3>
            <div className="h-56 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
              Bar Chart Here
            </div>
          </div>
        </div>

        {/* ================= RECENT EXPENSES ================= */}
        <div className="bg-card rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark">
              Recent Expenses
            </h3>

            <Link
              to="/expenses"
              className="text-sm text-(--accent) hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {[
              { title: "Grocery", amount: 1200, category: "Food" },
              { title: "Fuel", amount: 500, category: "Travel" },
              { title: "Internet Bill", amount: 999, category: "Bills" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="text-dark font-medium">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.category}
                  </p>
                </div>

                <div className="text-red-600 font-semibold">
                  ₹ {item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= QUICK ACTION ================= */}
        <div className="flex justify-end">
          <Link
            to="/addexpense"
            className="bg-primary text-white px-6 py-3 rounded-xl text-sm hover:opacity-90"
          >
            + Add Expense
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ExpenseData } from "../../context/ExpenseContext";

const AddExpense = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const { setExpenses } = useContext(ExpenseData);

    const [formData, setFormData] = useState({
        type: "expense",
        title: "",
        amount: "",
        category: "",
        date: today,
    });

    const expenseCategories = [
        "Food",
        "Travel",
        "Rent",
        "Bills",
        "Shopping",
        "Entertainment",
        "Health",
        "Other",
    ];

    const incomeCategories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Bonus",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTypeChange = (newType) => {
        setFormData((prev) => ({
            ...prev,
            type: newType,
            category: "", // reset category when type changes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");

        if (!formData.title || !formData.amount) {
            Swal.fire({
                title: "Error",
                text: "Please fill in all required fields",
                icon: "error",
            });
            return;
        }

        try {
            let res = await axios.post(
                `${import.meta.env.VITE_URI}/expense/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (res.status === 201) {
                Swal.fire({
                    title: `${formData.type === "income" ? "Income" : "Expense"} Added Successfully!`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    setExpenses((prev) => [res.data.expense, ...prev]);
                    navigate(-1);
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to add record",
                icon: "error",
            });
        }
    };

    const categories = formData.type === "income" ? incomeCategories : expenseCategories;

    return (
        <div className="bg-main flex items-center justify-center px-4 py-8">
            <div className="bg-card w-full max-w-md rounded-xl shadow-lg p-6 relative">
                {/* 🔙 Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-sm text-gray-500 hover:text-dark flex items-center gap-1"
                >
                    ← Back
                </button>

                {/* Header */}
                <h2 className="text-2xl font-semibold text-dark mb-1 text-center mt-2">
                    Add Transaction
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Record your income or expense details
                </p>

                {/* TYPE SELECTOR TOGGLE */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-5">
                    <button
                        type="button"
                        onClick={() => handleTypeChange("expense")}
                        className={`py-2 text-sm font-semibold rounded-md transition ${
                            formData.type === "expense"
                                ? "bg-red-600 text-white shadow"
                                : "text-gray-600 hover:text-dark"
                        }`}
                    >
                        💸 Expense (Kharch)
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTypeChange("income")}
                        className={`py-2 text-sm font-semibold rounded-md transition ${
                            formData.type === "income"
                                ? "bg-green-600 text-white shadow"
                                : "text-gray-600 hover:text-dark"
                        }`}
                    >
                        💰 Income (Aaya)
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Date */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            {formData.type === "income" ? "Income Source / Title" : "Expense Title"}
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={
                                formData.type === "income"
                                    ? "Salary / Client Work / Interest"
                                    : "Grocery / Rent / Fuel"
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="₹ 0"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className={`w-full mt-4 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition ${
                            formData.type === "income" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        + Add {formData.type === "income" ? "Income" : "Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;

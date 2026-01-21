import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        date: today,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");

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
                    title: res.data.message,
                    icon: "success",
                });
            } else {
                console.log(res);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="bg-main flex items-center justify-center px-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-lg p-6 relative">
                {/* 🔙 Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-sm text-gray-500 hover:text-dark"
                >
                    ← Back
                </button>

                {/* Header */}
                <h2 className="text-2xl font-semibold text-dark mb-1 text-center">
                    Add Expense
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Record your expense details
                </p>

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
                            Expense Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Grocery / Rent / Fuel"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            Amount
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

                    {/* Category (Expense based) */}
                    <div>
                        <label className="text-sm font-medium text-dark">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) "
                        >
                            <option value="">Select category</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Rent">Rent</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="
                            w-full mt-4 py-2 rounded-lg
                            bg-primary text-white font-medium
                            hover:opacity-90 transition
                        "
                    >
                        Add Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;

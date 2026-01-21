import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";
import { AuthData } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthData);
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("login");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === "login") {
                const response = await axios.post(
                    `${import.meta.env.VITE_URI}/Auth/login`,
                    {
                        email: formData.email,
                        password: formData.password,
                    },
                );

                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                }).then(() => {
                    login(response.data.token);
                    navigate("/dashboard", { replace: true });
                });
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_URI}/Auth/signup`,
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    },
                );

                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                }).then(() => setActiveTab("login"));
            }

            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            Swal.fire({
                title: err.response?.data?.message || "Server Error",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-linear-to-r from-[#b7adad] via-[#9fd6dc] to-[#6bddea] min-h-screen justify-center items-center px-4">
            <div className="bg-white w-full max-w-sm p-5 rounded-2xl shadow-2xl">
                <h2 className="text-center font-semibold text-2xl mb-4">
                    {activeTab === "login" ? "Login Form" : "Signup Form"}
                </h2>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    <Button
                        name="Login"
                        active={activeTab === "login"}
                        onclick={() => {
                            setActiveTab("login");
                        }}
                    />
                    <Button
                        name="Signup"
                        active={activeTab === "signup"}
                        onclick={() => setActiveTab("signup")}
                    />
                </div>

                {/* Form */}
                <form className="space-y-3" onSubmit={(e) => handleForm(e)}>
                    {activeTab === "login" ? (
                        <>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full border-gray-300 outline-none px-3 py-2 border rounded-xl"
                            />
                        </>
                    )}

                    <Button
                        active
                        name={
                            loading
                                ? activeTab === "login"
                                    ? "Logging in..."
                                    : "Signing up..."
                                : activeTab === "login"
                                  ? "Login"
                                  : "Signup"
                        }
                        onclick={loading ? null : undefined}
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;

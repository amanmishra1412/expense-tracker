import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";

const Login = () => {
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
        try {
            if (activeTab === "login") {
                const payLoad = {
                    email: formData.email,
                    password: formData.password,
                };
                let response = await axios.post(
                    "http://localhost:3000/Auth/login",
                    payLoad 
                );
                // console.log(response);
                if (response.status === 200) {
                    Swal.fire({
                        title: response.data.message,
                        icon: "success",
                    }).then(() => {
                        localStorage.setItem("token", response.data.token);
                    });
                } else {
                    console.log(response);
                }

                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                // console.log(formData);
                let response = await axios.post(
                    "http://localhost:3000/Auth/signup",
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }
                );
                console.log(response);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            }
        } catch (err) {
            console.log(err.response.data.message);
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
                        name={activeTab === "login" ? "Login" : "Signup"}
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;

import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { AuthData } from "../context/AuthContext";

const Navbar = () => {
    const navLink = ["dashboard", "expense"];
    const { logout } = useContext(AuthData);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
        setOpen(false);
    };

    return (
        <header className="bg-primary text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-bold">
                    Expense Tracker
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLink.map((path) => (
                        <NavLink
                            key={path}
                            to={`/${path}`}
                            className={({ isActive }) =>
                                `capitalize font-medium transition ${
                                    isActive
                                        ? "text-teal-200 border-b-2 border-teal-300"
                                        : "hover:text-teal-100"
                                }`
                            }
                        >
                            {path}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Button */}
                <div className="hidden md:block">
                    <Button name="Logout" onclick={handleLogout} active />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-2xl focus:outline-none"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-primary px-6 pb-4 space-y-4">
                    <nav className="flex flex-col gap-3">
                        {navLink.map((path) => (
                            <NavLink
                                key={path}
                                to={`/${path}`}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `capitalize font-medium ${
                                        isActive
                                            ? "text-teal-200"
                                            : "hover:text-teal-100"
                                    }`
                                }
                            >
                                {path}
                            </NavLink>
                        ))}
                    </nav>

                    <Button name="Logout" onclick={handleLogout} active />
                </div>
            )}
        </header>
    );
};

export default Navbar;

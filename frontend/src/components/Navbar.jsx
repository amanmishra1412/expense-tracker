import React from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
    const navLink = ["dashboard", "income", "expense"];
    return (
        <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-2xl font-bold tracking-wide">
                Expense Tracker
            </Link>

            <nav className="flex items-center gap-6">
                {navLink.map((path) => (
                    <NavLink
                        key={path}
                        to={`/${path}`}
                        className={({ isActive }) =>
                            `font-medium transition capitalize ${
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
            <div>
                <Button name="Logout" active={true} />
            </div>
        </header>
    );
};

export default Navbar;

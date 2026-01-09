import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-main text-dark">
            <Navbar />

            <main className="flex-1 px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

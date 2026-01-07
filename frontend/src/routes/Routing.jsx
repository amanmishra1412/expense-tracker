import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddIncome from "../pages/Dashboard/AddIncome";
import DashboardLayout from "../layout/DashboardLayout";

const Routing = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/income" element={<AddIncome />} />
                </Route>
            </Routes>
        </div>
    );
};

export default Routing;

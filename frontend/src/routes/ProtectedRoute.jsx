import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthData } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useContext(AuthData);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

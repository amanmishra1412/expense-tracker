import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthData } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { loading, isAuthenticated } = useContext(AuthData);

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;

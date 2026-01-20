import {  useEffect, useState } from "react";
import { AuthData } from "./AuthContext";


const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setUser({ token });
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthData.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthData.Provider>
    );
};

export default AuthContext;

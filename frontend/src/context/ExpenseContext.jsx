import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ExpenseData } from "./ExpenseContext";
import { AuthData } from "./AuthContext";

const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useContext(AuthData);

    useEffect(() => {
        if (!user?.token) return;

        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URI}/expense`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setExpenses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getData();
    }, [user?.token]);

    return (
        <ExpenseData.Provider value={{ expenses, setExpenses }}>
            {children}
        </ExpenseData.Provider>
    );
};

export default ExpenseProvider;

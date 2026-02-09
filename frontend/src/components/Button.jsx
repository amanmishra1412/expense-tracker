import React from "react";

const Button = ({ name, active, onclick, disabled }) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            onClick={onclick}
            className={`
                w-full px-4 py-2 rounded-xl font-medium capitalize
                transition-all duration-200
                ${
                    disabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : active
                          ? "bg-accent text-white shadow-md hover:brightness-95 active:scale-95"
                          : "border border-neutral text-text-dark hover:bg-accent-soft"
                }
            `}
        >
            {name}
        </button>
    );
};

export default Button;

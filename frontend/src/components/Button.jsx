import React from "react";

const Button = ({ name, active, onclick }) => {
    return (
        <button
            onClick={onclick}
            className={`px-4 ${
                active
                    ? "text-white capitalize bg-linear-to-r from-[#003E7A] to-[#0063C7]"
                    : "border-2  border-[#E7E7E7] "
            } w-full  py-2 rounded-2xl`}
        >
            {name}
        </button>
    );
};

export default Button;

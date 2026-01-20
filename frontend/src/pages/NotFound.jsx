import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-xl mt-2 mb-6">Page Not Found</p>

            <Link
                to="/"
                className="px-6 py-2 bg-teal-500 text-white rounded-lg"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;

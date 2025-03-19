import React from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../../auth";

const Signout = () => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await signout();
            console.log("Signed out successfully");
            navigate("/signin");
        } catch (error) {
            console.error("Signout error:", error.message);
        }
    };

    return (
        <button 
            onClick={handleSignout}
            className="border-2 border-red-400 hover:bg-red-900 p-2 rounded-4xl text-white"
        >
            Sign Out
        </button>
    );
};

export default Signout;
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, subscribeToAuthStateChange } from "../api/Client.js";

function ProtectedRoute({ children }) {
    const location = useLocation();
    const [token, setToken] = useState(() => getToken());

    useEffect(() => {
        return subscribeToAuthStateChange(() => {
            setToken(getToken());
        });
    }, []);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;

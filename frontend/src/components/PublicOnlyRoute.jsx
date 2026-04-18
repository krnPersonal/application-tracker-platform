import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, subscribeToAuthStateChange } from "../api/Client.js";

function PublicOnlyRoute({ children }) {
    const [token, setToken] = useState(() => getToken());

    useEffect(() => {
        return subscribeToAuthStateChange(() => {
            setToken(getToken());
        });
    }, []);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicOnlyRoute;

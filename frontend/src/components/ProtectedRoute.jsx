import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../api/Client.js";

function ProtectedRoute({ children }) {
    const token = getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;

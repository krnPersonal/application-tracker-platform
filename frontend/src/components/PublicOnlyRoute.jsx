import { Navigate } from "react-router-dom";
import { getToken } from "../api/Client.js";

function PublicOnlyRoute({ children }) {
    const token = getToken();

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicOnlyRoute;

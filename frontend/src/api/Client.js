const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export function getToken() {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
        return null;
    }
    return token;
}

export function setToken(token) {
    if (!token) {
        localStorage.removeItem("token");
        return;
    }
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
}

function withAuthHeaders(options = {}, { json = true } = {}) {
    const token = getToken();
    const headers = {
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return { ...options, headers };
}

async function handleErrors(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(error.message || "Request failed", response.status);
    }
}

export async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, withAuthHeaders(options));
    await handleErrors(response);

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function isUnauthorizedError(error) {
    return error instanceof ApiError && error.status === 401;
}

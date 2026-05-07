const BASE_URL = "http://localhost:3000";

function getAuthHeader() {
    // Token is stored as "Bearer eyJ..." so pass directly, no double-prefix
    return localStorage.getItem("accessToken") || "";
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
        const res = await fetch("https://app.devmindsstudio.co/v1/api/auth/refresh", {
            method: "GET",
            headers: {
                Authorization: refreshToken,
            },
        });

        if (!res.ok) return null;

        const data = await res.json();
        const newToken = data?.data?.accessToken;

        if (newToken) {
            localStorage.setItem("accessToken", newToken);
            return newToken;
        }
        return null;
    } catch {
        return null;
    }
}

async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
            ...options.headers,
        },
    });

    // Token expired — try refreshing once
    if (response.status === 401) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            // Refresh failed — force logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return null;
        }

        // Retry with new token
        const retry = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: newToken,
                ...options.headers,
            },
        });
        return retry.json();
    }

    return response.json();
}

export async function getGender(name) {
    return apiFetch(`${BASE_URL}/gender/${encodeURIComponent(name)}`);
}

export async function submitName(name) {
    return apiFetch(`${BASE_URL}/submit-name`, {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}

export async function getAllNames() {
    return apiFetch(`${BASE_URL}/gender-data`);
}
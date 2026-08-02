import { API_URL } from "../config/api.js";

export async function register(username, password) {

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "ngrok-skip-browser-warning": "true"},
        body: JSON.stringify({username, password})
    });

    const data = await response.json();

    return {ok: response.ok, data};
}


export async function login(username, password) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "ngrok-skip-browser-warning": "true"},
        body: JSON.stringify({username, password})
    });

    const data = await response.json();

    return {ok: response.ok, data};
}
const API_URL="http://localhost:8000";

interface RegisterData {
    name: string,
    username: string,
    email: string,
    password: string
}

interface LoginData {
    credential: string,
    password: string
}

export async function registerUser(registerData: RegisterData) {
    const response=await fetch(`${API_URL}/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
        credentials: "include"
    });
    return response.json();
};

export async function loginUser(loginData: LoginData) {
    const response=await fetch(`${API_URL}/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include"
    });
    return response.json();
};

export async function logoutUser() {
    const response=await fetch(`${API_URL}/logoutUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    return response.json();
};
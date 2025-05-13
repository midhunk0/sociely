const API_URL=import.meta.env.VITE_API_URL;

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
        credentials: "include",
        body: JSON.stringify(registerData)
    });
    return response.json();
};

export async function loginUser(loginData: LoginData) {
    const response=await fetch(`${API_URL}/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData)
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

export async function fetchProfile() {
    const response=await fetch(`${API_URL}/fetchProfile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    return response.json();
}

export async function fetchUser(userId: string) {
    const response=await fetch(`${API_URL}/fetchUser/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    return response.json();
}
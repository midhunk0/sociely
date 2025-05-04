import { redirect } from "@sveltejs/kit";

export function load({ cookies, url }) {
    const token=cookies.get("auth");

    if(!token && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/register")) {
        throw redirect(302, "/login");
    }

    if(url.pathname==="/"){
        throw redirect(307, "/home");
    }

    return { user: token ? { authenticated: true } : null };
}
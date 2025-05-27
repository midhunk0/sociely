/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext=createContext({
    theme: "dark",
    toggleTheme: ()=>{}
});

export function ThemeProvider({ children }: { children: React.ReactNode }){
    const [theme, setTheme]=useState<string>("dark");

    useEffect(()=>{
        const savedTheme=localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    function toggleTheme(){
        const newTheme=theme==="dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme(){
    return useContext(ThemeContext);
}
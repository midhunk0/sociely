import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
import "./Navbar.css";

interface SidebarItem{
    path: string;
    icon: string;
}

export default function Navbar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [theme, setTheme]=useState("dark");
    const [hoveredItem, setHoveredItem]=useState("");
    const [indicatorStyle, setIndicatorStyle]=useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    useEffect(()=>{
        const savedTheme=localStorage.getItem("theme") || "dark";
        setSavedTheme(savedTheme);
    }, []);

    const toggleTheme=()=>{
        const newTheme=theme==="dark" ? "light" : "dark";
        setSavedTheme(newTheme);
    };

    const setSavedTheme=(newTheme: string)=>{
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const sidebarItems: SidebarItem[]=[
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/add", icon: "add" },
        { path: "/chat", icon: "messages" },
        { path: "/profile", icon: "profile" },
    ];

    const handleMouseEnter=(e: React.MouseEvent<HTMLButtonElement>)=>{
        const rect=e.currentTarget.getBoundingClientRect();
        const offsetLeft=e.currentTarget.offsetLeft
        setIndicatorStyle({
            left: offsetLeft,
            width: rect.width,
            opacity: 1,
        });
    };

    const getIconSrc=(item: SidebarItem)=>{
        const isActive=location.pathname===item.path;

        if(isActive) return `/${item.icon}-active.png`;
        return `/${item.icon}.png`;
    };

    return(
        <nav className="navbar">
            <ul className="navbar-buttons" onMouseLeave={()=>setIndicatorStyle({ ...indicatorStyle, opacity: 0 })}>
                {sidebarItems.map((item, index)=>(
                    <li key={index}>
                        <button
                            className="navbar-button"
                            onClick={()=>navigate(item.path)}
                            onMouseEnter={(e)=>{
                                setHoveredItem(item.path)
                                handleMouseEnter(e); 
                            }}
                            onMouseLeave={()=>setHoveredItem("")}
                        >
                            <img src={getIconSrc(item)} alt={item.icon} className="icon"/>
                            {hoveredItem===item.path && <p className="navbar-tooltip">{item.icon}</p>}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={toggleTheme}
                        className="navbar-button"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={()=>setHoveredItem("")}
                    >
                        <img
                            src={hoveredItem==="theme" ? `/${theme}-active.png` : `/${theme}.png`}
                            alt="theme"
                            className="icon"
                        />
                    </button>
                </li>

                <li
                    className="navbar-indicator"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                        opacity: indicatorStyle.opacity,
                    }}
                />
            </ul>
        </nav>
    );
}

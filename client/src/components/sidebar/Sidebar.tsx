import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

interface SidebarItem{
    path: string;
    icon: string;
}

export default function Sidebar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [theme, setTheme]=useState("dark");
    const [hoveredItem, setHoveredItem]=useState("");
    const [indicatorStyle, setIndicatorStyle]=useState({ 
        top: 0, 
        width: 0, 
        opacity: 0 
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
        { path: "/add", icon: "add" },
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/chat", icon: "messages" },
        { path: "/profile", icon: "profile" },
    ];

    const handleMouseEnter=(e: React.MouseEvent<HTMLButtonElement>)=>{
        const rect=e.currentTarget.getBoundingClientRect();
        const offsetTop=e.currentTarget.offsetTop;
        setIndicatorStyle({ 
            top: offsetTop, 
            width: rect.width, 
            opacity: 1 
        });
    };

    const getIconSrc=(item: SidebarItem)=>{
        const isActive=location.pathname===item.path;

        if(isActive) return `/${item.icon}-active.png`;
        return `/${item.icon}.png`;
    };

    return(
        <nav className="sidebar">
            <button className="sidebar-logo" onClick={()=>navigate("/home")}> 
                <img src="/logo.png" alt="logo" className="icon"/>
            </button>

            <ul className="sidebar-buttons" onMouseLeave={()=>setIndicatorStyle({ ...indicatorStyle, opacity: 0 })}>
                {sidebarItems.map((item, index)=>(
                    <li key={index}>
                        <button
                            className="sidebar-button"
                            onClick={()=>navigate(item.path)}
                            onMouseEnter={(e)=>{
                                setHoveredItem(item.path);
                                handleMouseEnter(e);
                            }}
                            onMouseLeave={()=>setHoveredItem("")}
                        >
                            <img src={getIconSrc(item)} alt={item.icon} className="icon"/>
                            {hoveredItem===item.path && <p className="sidebar-tooltip">{item.icon}</p>}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={toggleTheme}
                        className="sidebar-button"
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
                    className="sidebar-indicator"
                    style={{
                        top: indicatorStyle.top,
                        width: indicatorStyle.width,
                        opacity: indicatorStyle.opacity
                    }}
                ></li>
            </ul>

            <button
                className="sidebar-settings"
                onMouseEnter={()=>setHoveredItem("settings")}
                onMouseLeave={()=>setHoveredItem("")}
                onClick={()=>navigate("/settings")}
            >
                <img src={getIconSrc({ path: "/settings", icon: "settings" })} alt="settings" className="icon"/>
                {hoveredItem==="settings" && <p className="sidebar-tooltip">settings</p>}
            </button>
        </nav>
    );
}

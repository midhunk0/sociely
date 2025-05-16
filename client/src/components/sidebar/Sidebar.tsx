import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

interface SidebarItem{
    path: string;
    icon: string;
};

interface IndicatorProps{
    top: number,
    width: number,
    opacity: number
};

type Part="middle" | "bottom";

export default function Sidebar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [theme, setTheme]=useState<string>("dark");
    const [hoveredItem, setHoveredItem]=useState<string>("");
    const [indicatorProps, setInticatorProps]=useState<Record<Part, IndicatorProps>>({
        middle: { top: 0, width: 0, opacity: 0 },
        bottom: { top: 0, width: 0, opacity: 0 },
    });

    const sidebarItems: SidebarItem[]=[
        { path: "/add", icon: "add" },
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/chat", icon: "messages" },
        { path: "/profile", icon: "profile" },
    ];

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

    const handleMouseEnter=(e: React.MouseEvent<HTMLButtonElement>, part: "middle" | "bottom", icon: string)=>{
        const rect=e.currentTarget.getBoundingClientRect();
        const offsetTop=e.currentTarget.offsetTop;
        setInticatorProps((prev)=>({
            ...prev,
            [part]: {
                top: offsetTop,
                width: rect.width,
                opacity: 1
            }
        }));

        setHoveredItem(icon);
    };

    const handleMouseLeave=(part: "middle" | "bottom")=>{
        setInticatorProps((prev)=>({
            ...prev,
            [part]: {
                ...prev[part],
                opacity: 0
            }
        }));

        setHoveredItem("");
    }

    const getIconSrc=(item: SidebarItem)=>{
        const isActive=location.pathname===item.path;
        return isActive || hoveredItem===item.icon ? `/${item.icon}-active.png` : `/${item.icon}.png`;
    };

    const renderIndicator=(part: Part)=>(
        <div
            className="sidebar-indicator"
            style={{
                top: indicatorProps[part].top,
                width: indicatorProps[part].width,
                opacity: indicatorProps[part].opacity
            }}
        />
    )

    return(
        <nav className="sidebar">
            <button className="sidebar-logo" onClick={()=>navigate("/home")}> 
                <img src="/logo.png" alt="logo" className="icon"/>
            </button>

            <div className="sidebar-buttons">
                {sidebarItems.map((item, index)=>(
                    <button
                        key={index}
                        className="sidebar-button"
                        onClick={()=>navigate(item.path)}
                        onMouseEnter={(e)=>{ handleMouseEnter(e, "middle", item.icon) }}
                        onMouseLeave={()=>{ handleMouseLeave("middle") }}
                    >
                        <img src={getIconSrc(item)} alt={item.icon} className="icon"/>
                        {hoveredItem===item.icon && <p className="sidebar-tooltip">{item.icon}</p>}
                    </button>
                ))}

                {renderIndicator("middle")}
            </div>

            <div className="sidebar-buttons">
                <button
                    onClick={toggleTheme}
                    className="sidebar-button"
                    onMouseEnter={(e)=>{ handleMouseEnter(e, "bottom", "theme") }}
                    onMouseLeave={()=>{ handleMouseLeave("bottom") }}
                >
                    <img src={hoveredItem==="theme" ? `/${theme}-active.png` : `/${theme}.png`} alt="theme" className="icon"/>
                </button>

                <button
                    className="sidebar-button"
                    onClick={()=>navigate("/settings")}
                    onMouseEnter={(e)=>{ handleMouseEnter(e, "bottom", "settings") }}
                    onMouseLeave={()=>{ handleMouseLeave("bottom") }}
                >
                    <img src={getIconSrc({ path: "/settings", icon: "settings" })} alt="settings" className="icon"/>
                    {hoveredItem==="settings" && <p className="sidebar-tooltip">settings</p>}
                </button>

                {renderIndicator("bottom")}
            </div>
        </nav>
    );
}

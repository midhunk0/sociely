import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Navbar.css";

interface NavbarItem{
    path: string;
    icon: string;
};

interface IndicatorProps{
    left: number,
    width: number,
    opacity: number
};

export default function Navbar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [hoveredItem, setHoveredItem]=useState<string>("");
    const [indicatorStyle, setIndicatorStyle]=useState<IndicatorProps>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const navbarItems: NavbarItem[]=[
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/add", icon: "add" },
        { path: "/chat", icon: "messages" },
        { path: "/profile", icon: "profile" },
    ];

    const handleMouseEnter=(e: React.MouseEvent<HTMLButtonElement>, icon: string)=>{
        const rect=e.currentTarget.getBoundingClientRect();
        const offsetLeft=e.currentTarget.offsetLeft
        setIndicatorStyle({
            left: offsetLeft,
            width: rect.width,
            opacity: 1,
        });

        setHoveredItem(icon);
    };

    const handleMouseLeave=()=>{
        setIndicatorStyle({
            ...indicatorStyle,
            opacity: 0
        });

        setHoveredItem("");
    };

    const getIconSrc=(item: NavbarItem)=>{
        const isActive=location.pathname===item.path;
        return isActive || hoveredItem===item.icon ? `/${item.icon}-active.png`: `/${item.icon}.png`;
    };

    return(
        <nav className="navbar">
            <div className="navbar-buttons">
                {navbarItems.map((item, index)=>(
                    <button
                        key={index}
                        className="navbar-button"
                        onClick={()=>navigate(item.path)}
                        onMouseEnter={(e)=> handleMouseEnter(e, item.icon) }
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={getIconSrc(item)} alt={item.icon} className="icon"/>
                        {hoveredItem===item.icon && <p className="navbar-tooltip">{item.icon}</p>}
                    </button>
                ))}

                <div
                    className="navbar-indicator"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                        opacity: indicatorStyle.opacity,
                    }}
                />
            </div>
        </nav>
    );
}

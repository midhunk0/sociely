import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Topbar.css";
import { useTheme } from "../../contexts/ThemeContext";

interface IndicatorProps{
    left: number,
    width: number,
    opacity: number
};

export default function Topbar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [hoveredItem, setHoveredItem]=useState<string>("");
    const [indicatorStyle, setIndicatorStyle]=useState<IndicatorProps>({
        left: 0,
        width: 0,
        opacity: 0,
    });
    const { theme, toggleTheme }=useTheme();

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
    }

    function getIconSrc(item: { path: string; icon: string }){
        const isActive=location.pathname===item.path;

        return isActive || hoveredItem===item.icon ? `/${item.icon}-active.png` : `/${item.icon}.png`;
    }

    return (
        <div className="topbar">
            <h2 onClick={()=>navigate("/home")}>sociely</h2>

            <div className="topbar-buttons" onMouseLeave={()=>setIndicatorStyle({ ...indicatorStyle, opacity: 0 })}>
                <button
                    onClick={toggleTheme}
                    className="topbar-button"
                    onMouseEnter={(e)=>handleMouseEnter(e, "theme")}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        src={hoveredItem==="theme" ? `/${theme}-active.png` : `/${theme}.png`}
                        alt="theme"
                        className="icon"
                    />
                </button>

                <button
                    className="topbar-button"
                    onMouseEnter={(e)=>handleMouseEnter(e, "settings")}
                    onMouseLeave={handleMouseLeave}
                    onClick={()=>navigate("/settings")}
                >
                    <img
                        src={getIconSrc({ path: "/settings", icon: "settings" })}
                        alt="settings"
                        className="icon"
                    />
                    {hoveredItem==="settings" && <p className="topbar-tooltip">settings</p>}
                </button>

                <div
                    className="topbar-indicator"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                        opacity: indicatorStyle.opacity,
                    }}
                />
            </div>
        </div>
    );
}

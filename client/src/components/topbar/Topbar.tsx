import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Topbar.css";

export default function Topbar(){
    const navigate=useNavigate();
    const location=useLocation();

    const [hover, setHover]=useState(false);

    const currentPath=location.pathname;

    function getIconSrc(item: { path: string; icon: string }){
        const isActive=currentPath===item.path;

        if (isActive) return `/${item.icon}-active.png`;
        return `/${item.icon}.png`;
    }

    return (
        <div className="topbar">
            <div className="topbar-heading">
                <button className="topbar-logo" onClick={()=>navigate("/home")}>
                    <img src="/logo.png" alt="logo" className="icon"/>
                </button>
                <h2>sociely</h2>
            </div>

            <button
                className="topbar-settings"
                onMouseEnter={()=>setHover(true)}
                onMouseLeave={()=>setHover(false)}
                onClick={()=>navigate("/settings")}
            >
                <img
                    src={getIconSrc({ path: "/settings", icon: "settings" })}
                    alt="settings"
                    className="icon"
                />
                {hover && <p className="topbar-tooltip">settings</p>}
            </button>
        </div>
    );
}

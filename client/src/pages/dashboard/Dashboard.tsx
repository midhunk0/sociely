import { Outlet } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Topbar from "../../components/topbar/Topbar";

export default function Dashboard() {
    const [isMobile, setIsMobile]=useState(false);

    useEffect(()=>{
        const handleResize=()=>setIsMobile(window.innerWidth<=440);
        handleResize();
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);

    return (
        !isMobile ? (
            <div className="layout">
                <Sidebar/>
                <div className="page-contents">
                    <Outlet/>
                </div>
            </div>
        ):(
            <div className="layout">
                <Topbar/>
                <div className="page-contents">
                    <Outlet/>
                </div>
                <Navbar/>
            </div>
        )
    );
}

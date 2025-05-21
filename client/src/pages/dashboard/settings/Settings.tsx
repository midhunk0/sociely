import { useNavigate } from "react-router-dom";
import "./Settings.css";
import { useState } from "react";

export default function Settings(){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [open, setOpen]=useState<boolean>(false);
    
    async function handleLogout(){
        try{
            const response=await fetch(`${apiUrl}/logoutUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while logout");
            }
            const result=await response.json();
            console.log(result.message);
            navigate("/login");
        }
        catch(error){
            console.log("Error while user logout: ", error);
        }
    }

    async function handleDelete(){
        try{
            const response=await fetch(`${apiUrl}/deleteUser`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while deleting user");
            }
            const result=await response.json();
            console.log(result.message);
            navigate("/register");
        }
        catch(error){
            console.log("Error while deleting user: ", error);
        }
    }

    return(
        <div className="settings">
            <h1>settings</h1>
            <button className="settings-button logout" type="button" onClick={handleLogout}>Logout</button>
            <button className="settings-button delete" type="button" onClick={()=>setOpen(true)}>Delete Account</button>
            {open && 
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>Are you sure to delete the account? </p>
                        <div className="modal-buttons">
                            <button type="button" className="delete" onClick={()=>{handleDelete(); setOpen(false)}}>Yes</button>
                            <button type="button" onClick={()=>setOpen(false)}>No</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
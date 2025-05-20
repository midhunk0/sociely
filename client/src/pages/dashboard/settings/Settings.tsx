import { useNavigate } from "react-router-dom";
import "./Settings.css";

export default function Settings(){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    
    async function handleLogout(){
        try{
            const response=await fetch(`${apiUrl}/logout`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                return;
            }
            const result=await response.json();
            console.log(result.message);
            navigate("/login");
        }
        catch(error){
            console.log("Error while user logout: ", error);
        }
    }

    return(
        <div className="settings">
            <h1>settings</h1>
            <button className="settings-button logout" type="button" onClick={handleLogout}>Logout</button>
        </div>
    )
}
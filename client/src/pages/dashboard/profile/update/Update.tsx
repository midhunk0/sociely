import React, { useState } from "react";
import "./Update.css";
import { useNavigate } from "react-router-dom";
import type { UpdateUserType } from "../../../../types/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

export default function Update(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();
    const profile=useSelector((state: RootState)=>state.profile);
    const theme=localStorage.getItem("theme");
    const [updateUserData, setUpdateUserData]=useState<UpdateUserType>({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        oldPassword: "",
        newPassword: ""
    });
    const [visible, setVisible]=useState<boolean[]>([false, false]);

    async function updateUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateUserData),
                credentials: "include"
            });
            const result=await response.json();
            if("verified" in result && !result.verified){
                navigate("/verification", { state: { email: result.email }});
            }
            console.log(result.message);
        }
        catch(error){
            console.log(error);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setUpdateUserData({
            ...updateUserData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <form className="update-form" onSubmit={updateUser}>
            <h1>Update User</h1>
            <div className="update-input">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={updateUserData.name} onChange={handleInputChange} placeholder="Alexander"/>
            </div>
            <div className="update-input">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={updateUserData.username} onChange={handleInputChange} placeholder="Alexander"/>
            </div>
            <div className="update-input">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={updateUserData.email} onChange={handleInputChange} placeholder="alexander@gmail.com"/>
            </div>
            <div className="update-input">
                <label htmlFor="oldPassword">Old password</label>
                <div className="update-password">
                    <input type={visible[0] ? "text" : "password"} id="oldPassword" name="oldPassword" value={updateUserData.oldPassword} onChange={handleInputChange} placeholder="Old password"/>
                    <button type="button" onClick={()=>setVisible((prev)=>[!prev[0], prev[1]])}>
                        <img src={visible[0] ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                    </button>
                </div>
            </div>
            <div className="update-input">
                <label htmlFor="newPassword">New password</label>
                <div className="update-password">
                    <input type={visible[1] ? "text" : "password"} id="newPassword" name="newPassword" value={updateUserData.newPassword} onChange={handleInputChange} placeholder="New password"/>
                    <button type="button" onClick={()=>setVisible((prev)=>[prev[0], !prev[1]])}>
                        <img src={visible[1] ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                    </button>
                </div>
            </div>
            <button type="submit" className="update-button">Update user</button>
        </form>
    )
}
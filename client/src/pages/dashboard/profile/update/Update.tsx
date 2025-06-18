import React, { useState } from "react";
import "./Update.css";
import { useNavigate } from "react-router-dom";
import type { UpdateUserType } from "../../../../types/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function Update(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();
    const profile=useSelector((state: RootState)=>state.profile);
    const [updateUserData, setUpdateUserData]=useState<UpdateUserType>({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        oldPassword: "",
        newPassword: ""
    });
    const [profileImage, setProfileImage]=useState<File>();
    const [visible, setVisible]=useState<boolean[]>([false, false]);
    const { theme }=useTheme();

    async function updateUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const formData=new FormData();
        formData.append("name", updateUserData.name ?? "");
        formData.append("username", updateUserData.username ?? "");
        formData.append("email", updateUserData.email ?? "");
        formData.append("oldPassword", updateUserData.oldPassword ?? "");
        formData.append("newPassword", updateUserData.newPassword ?? "");
        if(profileImage){
            formData.append("profileImage", profileImage);
        }

        try{
            const response=await fetch(`${apiUrl}/updateUser`, {
                method: "PUT",
                body: formData,
                credentials: "include"
            });
            const result=await response.json();
            if("verified" in result && !result.verified){
                navigate("/verification", { state: { email: result.email }});
            }
            else{
                navigate("/profile");
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

    function inputImage(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files){
            const image=e.target.files[0];
            setProfileImage(image);
        }
    }

    function removeImage(e: React.MouseEvent){
        e.preventDefault();
        setProfileImage(undefined);
    }

    return(
        <form className="update-form" onSubmit={updateUser}>
            <h1>Update User</h1>
            <div className="update-profile-input">
                <label htmlFor="image">Image</label>
                <label htmlFor="image" className="update-profile-image-input">Add image</label>
                <input type="file" name="image" id="image" onChange={inputImage} accept="image/*"/>
            </div>
            {profileImage && 
                <div className="update-profile-image">
                    <img src={URL.createObjectURL(profileImage)} alt="image"/>
                    <button type="button" className="update-profile-remove-image" onClick={(e)=>removeImage(e)}>
                        <img src="/close.png" alt="close" className="icon"/>
                    </button>
                </div>
            }
            <div className="form-input">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={updateUserData.name} onChange={handleInputChange} placeholder="Alexander"/>
            </div>
            <div className="form-input">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={updateUserData.username} onChange={handleInputChange} placeholder="Alexander"/>
            </div>
            <div className="form-input">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={updateUserData.email} onChange={handleInputChange} placeholder="alexander@gmail.com"/>
            </div>
            <div className="form-input">
                <label htmlFor="oldPassword">Old password</label>
                <div className="form-password">
                    <input type={visible[0] ? "text" : "password"} id="oldPassword" name="oldPassword" value={updateUserData.oldPassword} onChange={handleInputChange} placeholder="Old password"/>
                    <button type="button" onClick={()=>setVisible((prev)=>[!prev[0], prev[1]])}>
                        <img src={visible[0] ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                    </button>
                </div>
            </div>
            <div className="form-input">
                <label htmlFor="newPassword">New password</label>
                <div className="form-password">
                    <input type={visible[1] ? "text" : "password"} id="newPassword" name="newPassword" value={updateUserData.newPassword} onChange={handleInputChange} placeholder="New password"/>
                    <button type="button" onClick={()=>setVisible((prev)=>[prev[0], !prev[1]])}>
                        <img src={visible[1] ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                    </button>
                </div>
            </div>
            <button type="submit" className="form-button">Update user</button>
        </form>
    )
}
import React, { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/logo/Logo";
import type { RegisterDataType } from "../../../types/types";

export default function Register(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();

    const [registerData, setRegisterData]=useState<RegisterDataType>({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    const [visible, setVisible]=useState(false);
    const [theme, setTheme]=useState("dark");
    
    useEffect(()=>{
        const savedTheme=localStorage.getItem("theme") || "dark";
        setNewTheme(savedTheme);
    }, []);

    const setNewTheme=(newTheme: string)=>{
        setTheme(newTheme);
        document.body.classList.toggle("light-mode", newTheme==="light");
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    async function registerUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/registerUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/verification", { state: { email: result.email } });
            }
            console.log(result.message);
        }
        catch(error){
            console.log(error);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <>
        <Logo/>
        <div className="register-page">
            <img src="/community.png" alt="community" className="register-banner"/>
            <form className="register-form" onSubmit={registerUser}>
                <h1>Register</h1>
                <div className="form-input">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={registerData.name} onChange={handleInputChange} placeholder="Alexander" required/>
                </div>
                <div className="form-input">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={registerData.username} onChange={handleInputChange} placeholder="Alexander" required/>
                </div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={registerData.email} onChange={handleInputChange} placeholder="alexander@gmail.com" required/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <div className="form-password">
                        <input type={visible ? "text" : "password"} id="password" name="password" value={registerData.password} onChange={handleInputChange} placeholder="Password" required/>
                        <button type="button" onClick={()=>setVisible(visible=>!visible)}>
                            <img src={visible ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                        </button>
                    </div>
                </div>
                <button type="submit" className="form-button">Register</button>
                <p>Already have an account? <a href="/login">Login</a></p>
            </form>
        </div>
        </>
    )
}
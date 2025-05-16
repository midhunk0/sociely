import React, { useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/logo/Logo";

interface loginDataType{
    credential: string,
    password: string
}

export default function Login(){
    const API_URL=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();

    const [loginData, setLoginData]=useState<loginDataType>({
        credential: "",
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

    async function loginUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/home");
            }
            console.log(result.message);
        }
        catch(error){
            console.log(error);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <>
        <Logo/>
        <div className="login-page">
            <img src="/community.png" alt="community"/>
            <form className="login-form" onSubmit={loginUser}>
                <h1>Login</h1>
                <div className="login-input">
                    <label htmlFor="credential">Email or Username</label>
                    <input type="text" id="credential" name="credential" value={loginData.credential} onChange={handleInputChange} placeholder="alexander@gmail.com" required/>
                </div>
                <div className="login-input">
                    <label htmlFor="password">Password</label>
                    <div className="login-password">
                        <input type={visible ? "text" : "password"} id="password" name="password" value={loginData.password} onChange={handleInputChange} placeholder="Password" required/>
                        <button type="button" onClick={()=>setVisible(visible=>!visible)}>
                            <img src={visible ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                        </button>
                    </div>
                </div>
                <button type="submit" className="login-button">Login</button>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </form>
        </div>
        </>
    )
}
import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/logo/Logo";
import type { LoginDataType } from "../../../types/types";

export default function Login(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();

    const [loginData, setLoginData]=useState<LoginDataType>({
        credential: "",
        password: ""
    });
    const [visible, setVisible]=useState(false);
    const [theme, setTheme]=useState("dark");
    const [forgotPassword, setForgotPassword]=useState<boolean>(false);
    const [email, setEmail]=useState<string>("");

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
            const response=await fetch(`${apiUrl}/loginUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while login");
            }
            const result=await response.json();
            if(!result.verified){
                navigate("/verification", { state: { email: result.email } });
            }
            else{
                navigate("/home");
            }
            console.log(result.message);
        }
        catch(error){
            console.log(error);
        }
    }

    async function sendOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/sendOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while sending OTP");
            }
            const result=await response.json();
            navigate("/verification", { state: { email: result.email } });
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
            <img src="/community.png" alt="community" className="login-banner"/>
            {forgotPassword ? 
                <form className="login-form" onSubmit={sendOTP}>
                    <button type="button" onClick={()=>setForgotPassword(false)} className="back-button">
                        <img src={theme==="light" ? "/left.png" : "/left-white.png"} alt="left" className="icon"/>
                    </button>
                    <h1>Send OTP</h1>
                    <div className="form-input">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="alexander@gmail.com" required/>
                    </div>
                    <button type="submit" className="form-button">Send OTP</button>
                </form>
            :
                <form className="login-form" onSubmit={loginUser}>
                    <h1>Login</h1>
                    <div className="form-input">
                        <label htmlFor="credential">Email or Username</label>
                        <input type="text" id="credential" name="credential" value={loginData.credential} onChange={handleInputChange} placeholder="alexander@gmail.com" required/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="password">Password</label>
                        <div className="form-password">
                            <input type={visible ? "text" : "password"} id="password" name="password" value={loginData.password} onChange={handleInputChange} placeholder="Password" required/>
                            <button type="button" onClick={()=>setVisible(visible=>!visible)}>
                                <img src={visible ? theme==="light" ? "/eye.png" : "/eye-white.png" : theme==="light" ? "/eye-crossed.png" : "/eye-crossed-white.png"} alt="eye"/>
                            </button>
                        </div>
                    </div>
                    <a onClick={()=>setForgotPassword(true)}>Forgot password?</a>
                    <button type="submit" className="form-button">Login</button>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </form>
            }
        </div>
        </>
    )
}
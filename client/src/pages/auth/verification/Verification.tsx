import "./Verification.css";
import type { VerificationType } from "../../../types/types";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../components/logo/Logo";

export default function Verification(){
    const navigate=useNavigate();
    const location=useLocation();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const emailFromState=location.state.email || "";
    const [verificationData, setVerificationData]=useState<VerificationType>({
        email: emailFromState,
        otp: ""
    });
    const theme=localStorage.getItem("theme");

    useEffect(()=>{
        if(emailFromState){
            setVerificationData(prev=>({
                ...prev,
                email: emailFromState
            }))
        }
    }, [emailFromState]);
    
    async function verifyOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/verifyOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verificationData),
                credentials: "include"
            });
            const result=await response.json();
            if(!response.ok){
                // throw new Error("Error while verification");
            }
            if(result.verified){
                navigate("/home");
            }
            console.log(result.message);
        }
        catch(error){
            console.log("Error while verification: ", error);
        }
    }

    async function sendOTP(e: React.MouseEvent<HTMLAnchorElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/sendOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: verificationData.email }),
                credentials: "include"
            });
            const result=await response.json();
            if(!response.ok){
                // throw new Error("Error while verification");
            }
            console.log(result.message);
        }
        catch(error){
            console.log("Error while sending OTP: ", error);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setVerificationData({
            ...verificationData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <>
        <Logo/>
        <div className="verification">
            <img src="/community.png" alt="community" className="verification-banner"/>
            <form onSubmit={verifyOTP} className="verification-form">
                <button type="button" className="back-button" onClick={()=>navigate(-1)}>
                    <img src={theme==="light" ? "/left.png" : "/left-white.png"} alt="left" className="icon"/>
                </button>
                <h1>Verify OTP</h1>
                <div className="verification-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" value={verificationData.email} onChange={handleInputChange} placeholder="alexander@gmail.com" required/>
                </div>
                <div className="verification-input">
                    <label htmlFor="otp">OTP</label>
                    <input type="text" name="otp" id="otp" value={verificationData.otp} onChange={handleInputChange} placeholder="000000" required/>
                </div>
                <a href="#" onClick={sendOTP}>Send new OTP</a>
                <button type="submit" className="verification-button">Verify</button>
            </form>
        </div>
        </>
    )
}
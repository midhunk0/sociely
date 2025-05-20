/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./user.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

interface userType{
    name?: string;
    username?: string;
    email?: string;
    followers?: string[];
    followings?: string[];
    posts?: string[];
    _id?: string;
}

export default function User(){
    const { username }=useParams();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const profile=useSelector((state: RootState)=>state.profile);
    const [user, setUser]=useState<userType>({});
    const [activeTab, setActiveTab]=useState<string>("posts");
    const [isFollowing, setIsFollowing]=useState<boolean>(false);
    const [isMe, setIsMe]=useState<boolean>(false);

    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const response=await fetch(`${apiUrl}/fetchUser/${username}`, {
                    method: "GET",
                    credentials: "include"
                });
                if(!response.ok){
                    throw new Error("Failed to fetch user");
                }
                const result=await response.json();
                console.log(result);
                setUser(result.user);
                setIsFollowing(profile.followings?.includes(result.user._id) ?? false);
                setIsMe(profile.username===user.username);
            }
            catch(error){
                console.log("Error while verifying user: ", error);
            }
        };

        fetchUser();
    }, [apiUrl, username, profile]);


    return(
        <div className="user">
            <div className="user-header">
                <img src="/logo.png" alt="user" className="user-image"/>
                <div className="user-details">
                    <div className="user-details-header">
                        <h1>{user.username}</h1>
                        {!isMe && 
                            <button className="user-edit-button">
                                {isFollowing ? "Unfollow" : "Follow"} user
                            </button>
                        }
                    </div>
                    <p>{user.name}</p>
                    <div className="user-user-details">
                        <p onClick={()=>setActiveTab("posts")}>{user.posts?.length} posts</p>
                        <p onClick={()=>setActiveTab("followers")}>{user.followers?.length} followers</p>
                        <p onClick={()=>setActiveTab("followings")}>{user.followings?.length} followings</p>
                    </div>
                </div>
            </div>
            {activeTab==="posts" && (user.posts?.length===0 ? 
                <div className="user-empty">
                    <p>No posts</p> 
                </div>
            : 
                <p>Has posts</p>
            )}
            {activeTab==="followers" && (user.followers?.length===0 ? 
                <div className="user-empty">
                    <p>No followers</p> 
                </div>
            : 
                <p>Has followers</p>
            )}
            {activeTab==="followings" && (user.followings?.length===0 ? 
                <div className="user-empty">
                    <p>No followings</p> 
                </div>
            : 
                <p>Has followings</p>
            )}
        </div>
    )
}
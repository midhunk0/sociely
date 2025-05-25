/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./User.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useFetch from "../../../hooks/useFetch";
import UsersList from "../../../components/usersList/UsersList";
import type { UserRef, UserType } from "../../../types/types";

export default function User(){
    const { userId }=useParams();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const profile=useSelector((state: RootState)=>state.profile);
    const [user, setUser]=useState<UserType>();
    const [activeTab, setActiveTab]=useState<string>("posts");
    const [isFollowing, setIsFollowing]=useState<boolean>(false);
    const [hover, setHover]=useState<boolean>(false);
    const [isMe, setIsMe]=useState<boolean>(false);
    const { followers, followings, fetchFollowers, fetchFollowings }=useFetch();

    const fetchUser=async()=>{
        try{
            const response=await fetch(`${apiUrl}/fetchUser/${userId}`, {
                method: "GET",
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Failed to fetch user");
            }
            const result=await response.json();
            setUser(result.user);
            setIsFollowing(result.user.followers?.some((follower: UserRef)=>follower.userId===profile._id) || false);
            setIsMe(profile.username===result.user.username);
        }
        catch(error){
            console.log("Error while verifying user: ", error);
        }
    };

    useEffect(()=>{
        fetchUser();
    }, [apiUrl, userId, profile]);

    useEffect(()=>{
        if(user && user._id){
            fetchFollowers(user._id);
            fetchFollowings(user._id);
        }
    }, [user]);

    async function toggleFollowUser(userId: string){
        try{
            const response=await fetch(`${apiUrl}/toggleFollowUser/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Failed to follow user");
            }
            const result=await response.json();
            console.log(result.message);
            await fetchUser();
        }
        catch(error){
            console.log("Error while following user: ", error);
        }
    }

    if(!user){
        return;
    }

    return(
        <div className="user">
            <div className="user-header">
                <img src="/profile-active.png" alt="user" className="user-image"/>
                <div className="user-details">
                    <div className="user-details-header">
                        <h1>{user.username}</h1>
                        {!isMe && 
                            <button className="user-toggle-follow-button" onClick={()=>toggleFollowUser(user._id || "")} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                                {isFollowing 
                                    ? <img src={hover ? "/unfollow-active.png" : "/unfollow.png"} alt="unfollow" className="icon"/> 
                                    : <img src={hover ? "/follow-active.png" : "/follow.png"} alt="follow" className="icon"/>
                                }
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
            <hr/>
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
                <UsersList users={followers}/>
            )}
            {activeTab==="followings" && (user.followings?.length===0 ? 
                <div className="user-empty">
                    <p>No followings</p> 
                </div>
            : 
                <UsersList users={followings}/>
            )}
        </div>
    )
}
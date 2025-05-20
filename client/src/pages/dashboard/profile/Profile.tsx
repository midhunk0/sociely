/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Profile.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useFetch from "../../../hooks/useFetch";
import UsersList from "../../../components/usersList/UsersList";

export default function Profile(){
    const profile=useSelector((state: RootState)=>state.profile);
    const [activeTab, setActiveTab]=useState<string>("posts");
    const { followers, fetchFollowers, followings, fetchFollowings }=useFetch();

    useEffect(()=>{
        if(profile._id){
            fetchFollowers(profile._id);
            fetchFollowings(profile._id);
        }
    }, [profile._id]);

    return(
        <div className="profile">
            <div className="profile-header">
                <img src="/profile-active.png" alt="profile" className="profile-image"/>
                <div className="profile-details">
                    <div className="profile-details-header">
                        <h1>{profile.username}</h1>
                        <button className="profile-edit-button">Edit profile</button>
                    </div>
                    <p>{profile.name}</p>
                    <div className="profile-user-details">
                        <p onClick={()=>setActiveTab("posts")}>{profile.posts?.length} posts</p>
                        <p onClick={()=>setActiveTab("followers")}>{profile.followers?.length} followers</p>
                        <p onClick={()=>setActiveTab("followings")}>{profile.followings?.length} followings</p>
                    </div>
                </div>
            </div>
            {activeTab==="posts" && (profile.posts?.length===0 ? 
                <div className="profile-empty">
                    <p>No posts</p> 
                </div>
            : 
                <p>Has posts</p>
            )}
            {activeTab==="followers" && (profile.followers?.length===0 ? 
                <div className="profile-empty">
                    <p>No followers</p> 
                </div>
            : 
                <UsersList users={followers}/>
            )}
            {activeTab==="followings" && (profile.followings?.length===0 ? 
                <div className="profile-empty">
                    <p>No followings</p> 
                </div>
            : 
                <UsersList users={followings}/>
            )}
        </div>
    )
}
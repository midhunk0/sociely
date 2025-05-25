/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Profile.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useFetch from "../../../hooks/useFetch";
import UsersList from "../../../components/usersList/UsersList";
import { useNavigate } from "react-router-dom";
import Posts from "../../../components/posts/Posts";

export default function Profile(){
    const navigate=useNavigate();
    const profile=useSelector((state: RootState)=>state.profile);
    const [activeTab, setActiveTab]=useState<string>("posts");
    const [hover, setHover]=useState<boolean>(false);
    const { followers, fetchFollowers, followings, fetchFollowings, posts, fetchPosts }=useFetch();

    useEffect(()=>{
        if(profile._id){
            fetchFollowers(profile._id);
            fetchFollowings(profile._id);
            fetchPosts(profile._id);
        }
    }, [profile._id]);

    return(
        <div className="profile">
            <div className="profile-header">
                <img src="/profile-active.png" alt="profile" className="profile-image"/>
                <div className="profile-details">
                    <div className="profile-details-header">
                        <h1>{profile.username}</h1>
                        <button className="profile-edit-button" onClick={()=>navigate("/profile/update")} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                            <img src={hover ? "./edit-active.png" : "./edit.png"} alt="edit" className="icon"/>
                        </button>
                    </div>
                    <p>{profile.name}</p>
                    <div className="profile-user-details">
                        <p onClick={()=>setActiveTab("posts")}>{profile.posts?.length} posts</p>
                        <p onClick={()=>setActiveTab("followers")}>{profile.followers?.length} followers</p>
                        <p onClick={()=>setActiveTab("followings")}>{profile.followings?.length} followings</p>
                    </div>
                </div>
            </div>
            <hr/>
            {activeTab==="posts" && (profile.posts?.length===0 ? 
                <div className="profile-empty">
                    <p>No posts</p> 
                </div>
            : 
                <Posts userPosts={posts}/>
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
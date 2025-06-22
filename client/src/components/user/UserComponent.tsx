/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./UserComponent.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import useFetch from "../../hooks/useFetch";
import type { UserRef } from "../../types/types";
import PostsComponent from "../posts/PostsComponent";
import UsersComponent from "../users/UsersComponent";
import { useNavigate } from "react-router-dom";

export default function UserComponent({ userId }: { userId: string | undefined }){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const profile=useSelector((state: RootState)=>state.profile);
    const [activeTab, setActiveTab]=useState<string>("posts");
    const [isFollowing, setIsFollowing]=useState<boolean>(false);
    const [hover, setHover]=useState<boolean>(false);
    const [isMe, setIsMe]=useState<boolean>(false);
    const { user, fetchUser, followers, followings, fetchFollowers, fetchFollowings, posts, fetchPosts }=useFetch();
    const navigate=useNavigate();

    useEffect(()=>{
        setIsFollowing(user?.followers?.some((follower: UserRef)=>follower.userId===profile._id) || false);
        setIsMe(profile.username===user?.username);
    }, [apiUrl, user]);

    useEffect(()=>{
        if(userId){
            fetchUser(userId);
            fetchFollowers(userId);
            fetchFollowings(userId);
            fetchPosts(userId);
        }
    }, [userId]);

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
        }
        catch(error){
            console.log("Error while following user: ", error);
        }
    }

    if(!user){
        return;
    }

    return(
        <div className="user-component">
            <div className="user-header">
                <img src={user.imageUrl || "/profile-active.png"} alt="user" className="user-image"/>
                <div className="user-details">
                    <div className="user-details-header">
                        <h1>{user.username}</h1>
                        {isMe ?
                            <button className="profile-edit-button" onClick={()=>navigate("/profile/update")} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                                <img src={hover ? "/edit-active.png" : "/edit.png"} alt="edit" className="icon"/>
                            </button>
                        :
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
                <PostsComponent posts={posts}/>
            )}
            {activeTab==="followers" && (user.followers?.length===0 ? 
                <div className="user-empty">
                    <p>No followers</p> 
                </div>
            : 
                <UsersComponent users={followers}/>
            )}
            {activeTab==="followings" && (user.followings?.length===0 ? 
                <div className="user-empty">
                    <p>No followings</p> 
                </div>
            : 
                <UsersComponent users={followings}/>
            )}
        </div>
    )
}
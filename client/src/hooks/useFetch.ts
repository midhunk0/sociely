import { useState } from "react";
import type { FetchedPostType, UserType } from "../types/types";

export default function useFetch(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [followings, setFollowings]=useState<UserType[]>([]);
    const [followers, setFollowers]=useState<UserType[]>([]);
    const [posts, setPosts]=useState<FetchedPostType[]>([]);
    const [post, setPost]=useState<FetchedPostType>();

    async function fetchFollowers(userId: string){
        try{
            const response=await fetch(`${apiUrl}/fetchFollowers/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while fetching follower list");
            }
            const result=await response.json();
            setFollowers(result.followers);
        }
        catch(error){
            console.log("Error while fetching follower list: ", error);
        }
    }

    async function fetchFollowings(userId: string){
        try{
            const response=await fetch(`${apiUrl}/fetchFollowings/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Error while fetching following list");
            }
            const result=await response.json();
            setFollowings(result.followings);
        }
        catch(error){
            console.log("Error while fetching following list: ", error);
        }
    }

    async function fetchPosts(userId: string){
        try{
            const response=await fetch(`${apiUrl}/fetchPosts/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            setPosts(result.posts);
        }
        catch(error){
            console.log("Error while fetching posts: ", error);
        }
    }

    async function fetchPost(postId: string){
        try{    
            const response=await fetch(`${apiUrl}/fetchPost/${postId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            setPost(result.post);
        }
        catch(error){
            console.log("Error while fetching post: ", error);
        }
    }

    return{
        followers,
        fetchFollowers,
        followings,
        fetchFollowings,
        posts,
        fetchPosts,
        post,
        fetchPost
    }
}
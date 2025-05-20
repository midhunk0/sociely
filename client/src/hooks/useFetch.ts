import { useState } from "react";
import type { UserType } from "../types/types";

export default function useFetch(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [followings, setFollowings]=useState<UserType[]>([]);
    const [followers, setFollowers]=useState<UserType[]>([]);

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

    return{
        followers,
        fetchFollowers,
        followings,
        fetchFollowings
    }
}
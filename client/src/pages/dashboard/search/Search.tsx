import { useEffect, useState } from "react";
import "./Search.css";
import UsersList from "../../../components/users/Users";
import type { UserType } from "../../../types/types";

export default function Search(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [identifier, setIdentifier]=useState<string>("");
    const [users, setUsers]=useState<UserType[]>([]);

    useEffect(()=>{
        if(!identifier.trim()){
            setUsers([]);
            return;
        }

        const searchUser=async()=>{
            try{
                const response=await fetch(`${apiUrl}/searchUser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier }),
                    credentials: "include"
                });
                if(!response.ok){
                    setUsers([]);
                    throw new Error("Failed to search user");
                }
                const result=await response.json();
                setUsers(result.users);
            }
            catch(error){
                setUsers([]);
                console.log("Error while searching user: ", error);
            }
        };

        searchUser();
    }, [ identifier, apiUrl ]);

    return(
        <div className="search">
            <h1>search</h1>
            <input type="text" name="identifier" value={identifier} className="search-bar" placeholder="alexander0" onChange={(e)=>setIdentifier(e.target.value)}/>
            {users && users.length===0 && identifier.trim() && (
                <p>No users found</p>
            )}
            <UsersList users={users}/>
        </div>
    )
}
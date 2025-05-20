import { useEffect, useState } from "react";
import "./Search.css";
import { useNavigate } from "react-router-dom";

interface UserType{
    name?: string;
    username?: string;
    email?: string;
    followers?: [];
    followings?: [];
    posts?: [];
    _id?: string;
}

export default function Search(){
    const navigate=useNavigate();
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
                    console.log("Some error");
                    return;
                }
                const result=await response.json();
                console.log(result);
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
            {users && users.map((user, index)=>
                user && user.username ? (
                    <div key={index} className="search-user" onClick={()=>navigate(`/${user.username}`)}>
                        <img src="./logo.png" alt="user"/>
                        <p>{user.username}</p>
                    </div> 
                ) : null
            )}
        </div>
    )
}
import "./Users.css";
import { useNavigate } from "react-router-dom";
import type { UserType } from "../../types/types";

export default function Users({ users }: { users: UserType[] }){
    const navigate=useNavigate();

    return(
        users && users.map((user, index)=>
            user && user.username ? (
                <div key={index} className="usersList-user" onClick={()=>navigate(`/user/${user._id}`)}>
                    <img src="/profile-active.png" alt="user"/>
                    <p>{user.username}</p>
                </div> 
            ) : null
        )
    )
}
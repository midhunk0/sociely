import "./UsersComponent.css";
import type { UserType } from "../../types/types";
import { useNavigate } from "react-router-dom";

export default function UsersComponent({ users }: { users: UserType[]}){
    const navigate=useNavigate();

    return(
        users && users.map((user, index)=>
            user && user.username ? (
                <div key={index} className="usersList-user" onClick={()=>navigate(`/user/${user._id}`)}>
                    <img src={user.imageUrl ? user.imageUrl : "/profile-active.png"} alt="user"/>
                    <p>{user.username}</p>
                </div> 
            ) : null
        )
    )
}
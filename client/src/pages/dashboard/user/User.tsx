import { useParams } from "react-router-dom";
import UserComponent from "../../../components/user/UserComponent";
import "./User.css";

export default function User(){
    const { userId }=useParams();

    return(
        <div className="user">
            <UserComponent userId={userId}/>
        </div>
    )
}
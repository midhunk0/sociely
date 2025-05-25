import { useNavigate } from "react-router-dom";
import type { FetchedPostType } from "../../types/types";
import "./Posts.css";

interface props{
    userPosts: FetchedPostType[]
}

export default function Posts({userPosts}: props){
    const navigate=useNavigate();

    return(
        <div className="posts">
            {userPosts.map((post)=>(
                <div key={post._id} className="posts-post" onClick={()=>navigate(`/post/${post._id}`)}>
                    {post.imageUrls.map((image, index)=>(
                        <img key={index} src={image} alt="image"/>
                    ))}
                </div>
            ))}
        </div>
    )
}
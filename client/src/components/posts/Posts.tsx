import { useNavigate } from "react-router-dom";
import type { FetchedPostType } from "../../types/types";
import "./Posts.css";
import { useEffect, useState } from "react";

interface props{
    userPosts: FetchedPostType[]
}

export default function Posts({userPosts}: props){
    const navigate=useNavigate();
    const [imagesLoaded, setImagesLoaded]=useState<boolean>(false);

    useEffect(()=>{
        if(!userPosts.length) return;

        const imageUrls=userPosts.flatMap(post=>post.imageUrls);
        const loadImages=imageUrls.map(src=>{
            return new Promise((resolve)=>{
                const img=new Image();
                img.src=src;
                img.onload=resolve;
                img.onerror=resolve;
            });
        });
        Promise.all(loadImages).then(()=>setImagesLoaded(true));
    }, [userPosts]);

    if(!imagesLoaded){
        return(
            <div className="posts">
                {[...Array(5)].map((_, index)=>(
                    <div key={index} className="posts-post skeleton"></div>
                ))}
            </div>
        )
    }

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
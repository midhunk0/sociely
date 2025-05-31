/* eslint-disable react-hooks/exhaustive-deps */
import "./PostComponent.css";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

export default function PostComponent({ postId }: { postId: string | undefined }){
    const { post, fetchPost, user, fetchUser }=useFetch();

    useEffect(()=>{
        fetchPost(postId || "");
    }, [postId]);

    useEffect(()=>{
        if(post?.userId){
            fetchUser(post.userId);
        }
    }, [post]);

    function formatDate(dateInput: string){
        const date=new Date(dateInput);

        const day=date.getUTCDate();
        const month=date.toLocaleString("default", { month: "long" });
        const year=date.getUTCFullYear();

        let postFix="";
        if(day>3 && day<21) postFix="th";
        switch(day % 10){
            case 1: postFix="st"; break;
            case 2: postFix="nd"; break;
            case 3: postFix="rd"; break;
            default: postFix="th"; break;
        }

        const formattedDate=`${day}${postFix} ${month} ${year}`;
        return formattedDate;
    }
    
    return(
        post && user && 
        <div key={post._id} className="post">
            <div className="post-user">
                <img src="/profile.png" className="icon"/>
                <p>{user.username}</p>
            </div>
            <div className="post-desc">
                <h3>{post.title}</h3>:
                <p>{post.description}</p>
            </div>
            {post.imageUrls.map((image, index)=>(
                <img key={index} src={image} alt="image" className="post-image"/>
            ))}
            <div className="post-details">
                <div className="div-buttons">
                    <button>like</button>
                    <button>comment</button>
                </div>
                <p>{formatDate(post.createdAt)}</p>
            </div>
        </div>
    )
}
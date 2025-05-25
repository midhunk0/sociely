/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import "./Post.css";
import { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";

export default function Post(){
    const { postId }=useParams();
    const { post, fetchPost }=useFetch();

    useEffect(()=>{
        fetchPost(postId || "");
    }, [postId]);

    if(!post){
        return <div className="loading">Loading...</div>;
    }

    return(
        <div key={post._id} className="post">
            {post.imageUrls.map((image, index)=>(
                <img key={index} src={image} alt="image"/>
            ))}
        </div>
    )
}
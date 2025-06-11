import { useEffect, useState } from "react";
import "./Home.css";
import type { FetchedPostType } from "../../../types/types";

export default function Home(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [posts, setPosts]=useState<FetchedPostType[]>();

    useEffect(()=>{
        async function fetchAllPosts(){
            try{
                const response=await fetch(`${apiUrl}/fetchAllPosts`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                setPosts(result.posts);
                console.log(result.message);
            }
            catch(error){
                console.log(error);
            }
        }
        fetchAllPosts();
    }, [apiUrl]);

    if(posts?.length===0){
        return(
            <div className="home">
                <p>No posts</p>
            </div>
        )
    }

    return(
        <div className="home">
            {posts && posts?.length>0 && (
                <div className="home-posts">
                    {posts.map((post)=>(
                        <div key={post._id} className="home-post">
                            <h2>{post.title}</h2>
                            {post.imageUrls.map((url, i)=>(
                                <img key={i} src={url} alt={`Post ${i+1}`}/>
                            ))}
                            <p>{post.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}
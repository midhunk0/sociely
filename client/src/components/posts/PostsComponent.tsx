import type { FetchedPostType } from "../../types/types";
import "./PostsComponent.css";
import { useEffect, useState } from "react";

export default function PostsComponent({ posts }: { posts: FetchedPostType[]}){
    const [imagesLoaded, setImagesLoaded]=useState<boolean>(false);
    const [view, setView]=useState<string>("grid");

    useEffect(()=>{
        if(!posts.length) return;

        const imageUrls=posts.flatMap(post=>post.imageUrls);
        const loadImages=imageUrls.map(src=>{
            return new Promise((resolve)=>{
                const img=new Image();
                img.src=src;
                img.onload=resolve;
                img.onerror=resolve;
            });
        });
        Promise.all(loadImages).then(()=>setImagesLoaded(true));
    }, [posts]);

    if(!imagesLoaded){
        return(
            <div className="posts">
                {[...Array(5)].map((_, index)=>(
                    <div key={index} className="posts-grid skeleton"></div>
                ))}
            </div>
        )
    }

    return(
        <div className="posts">
            {view==="grid" 
                ? posts.map((post)=>(
                    <div key={post._id} className="posts-grid" onClick={()=>setView("list")}>
                        {post.imageUrls && post.imageUrls.map((image, index)=>(
                            <img key={index} src={image} alt="image"/>
                        ))}
                    </div>
                ))
                : <div className="posts-list-header">
                    <img src="/left-white.png" alt="left" className="icon" onClick={()=>setView("grid")}/>
                    <div className="posts-list">
                        {posts.map((post)=>(
                            <div key={post._id} className="posts-list-post">
                                <h2>{post.title}</h2>
                                {post.imageUrls && post.imageUrls.map((image, index)=>
                                    <img key={index} src={image} alt="image"/>
                                )}
                                <p>{post.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
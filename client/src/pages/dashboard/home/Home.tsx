import { useEffect, useState } from "react";
import "./Home.css";
import type { FetchedPostType } from "../../../types/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

interface showComment{
    postId: string;
    show: boolean;
}

export default function Home(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const profile=useSelector((state: RootState)=>state.profile);
    const [posts, setPosts]=useState<FetchedPostType[]>();
    const [showComments, setShowComments]=useState<showComment>({ postId: "", show: false });
    const [comment, setComment]=useState<string>("");

    useEffect(()=>{
        async function fetchAllPosts(){
            try{
                const response=await fetch(`${apiUrl}/fetchAllPosts`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                setPosts(result.posts);
                console.log(result.posts);
            }
            catch(error){
                console.log(error);
            }
        }
        fetchAllPosts();
    }, [apiUrl]);

    if(!posts){
        return(
            <div className="home-skeleton">
                {[...Array(5)].map((_, i)=>(
                    <div className="home-post skeleton" key={i}>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-buttons"></div>
                    </div>
                ))}
            </div>
        )
    }

    if(posts?.length===0){
        return(
            <div className="home">
                <p>No posts</p>
            </div>
        )
    }

    async function toggleLike(postId: string){
        const hasLiked=posts?.find(post=>post._id===postId)?.likes.some(like=>like.userId===profile._id);
        setPosts(prevPosts=>
            prevPosts?.map(post=>{
                if(post._id===postId){
                    const updatedLikes=hasLiked
                        ? post.likes.filter(like=>like.userId!==profile._id)
                        : [...post.likes, { userId: profile._id }];

                    return {
                        ...post,
                        likes: updatedLikes as typeof post.likes, 
                        likesCount: hasLiked
                            ? Math.max(0, post.likesCount-1)
                            : post.likesCount+1,
                    };
                }
                return post;
            })
        );

        try{
            const response=await fetch(`${apiUrl}/toggleLike/${postId}`, {
                method: "PUT",
                credentials: "include"
            });
            const result=await response.json();
            console.log(result.message);
        }
        catch(error){
            console.log("Toggle like error:", error);
        }
    }

    async function addComment(postId: string){
        try{
            const response=await fetch(`${apiUrl}/addComment/${postId}`, {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ comment }),
                credentials: "include"
            });
            const result=await response.json();
            setComment("");
            console.log(result.message);
        }
        catch(error){
            console.log("Error in sending comment: ", error);
        }
    }

    return(
        <div className="home">
            {posts && posts?.length>0 && (
                <div className="home-posts">
                    {posts.map((post)=>(
                        <div key={post._id} className="home-post">
                            <h2>{post.title}</h2>
                            {post.imageUrls && post.imageUrls.map((url, i)=>(
                                <img className="home-post-image" key={i} src={url} alt={`Post ${i+1}`}/>
                            ))}
                            {/* <img src={post.user.profileImage ? post.user.profileImage : "/profile.png"} alt="profile" className="icon"/> */}
                            <p>{post.user.username}</p>
                            <p>{post.description}</p>
                            <div className="home-post-options">
                                <div className="home-post-like">
                                    {post.likes.some(like=>like.userId===profile._id) 
                                        ? <img src="/like-active.png" alt="unlike" className="icon" onClick={()=>toggleLike(post._id)}/>
                                        : <img src="/like.png" alt="like" className="icon" onClick={()=>toggleLike(post._id)}/>
                                    }
                                    <p>{post.likesCount}</p>
                                </div>
                                <div className="home-post-comment-toggle" onClick={()=>setShowComments(prev=>({postId:post._id, show: prev.postId===post._id ? !prev.show : true}))}>
                                    comments
                                    {showComments.postId===post._id && showComments.show 
                                        ? <img src="/up-arrow.png" alt="up" className="icon"/>
                                        : <img src="/down-arrow.png" alt="down" className="icon"/>
                                    }
                                </div>
                            </div>
                            {showComments.postId===post._id && showComments.show && (
                                <div className="home-post-comments">
                                    {post.comments.length!==0 ? (
                                        post.comments.map(comment=>(
                                            <div className="home-post-comment" key={comment._id}>
                                                <p>{comment.comment}</p>
                                            </div>
                                        ))
                                    ) : (                                        
                                        <p>No comments</p>
                                    )}
                                    <div className="home-post-comment-form">
                                        <input type="text" placeholder="add comment" onChange={(e)=>setComment(e.target.value)}/>
                                        <button className="home-post-comment-send" type="button" onClick={()=>addComment(post._id)}>
                                            <img src="/send.png" alt="send" className="icon"/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
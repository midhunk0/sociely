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
    const [showComments, setShowComments]=useState<showComment>({postId: "", show: false});

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

    return(
        <div className="home">
            {posts && posts?.length>0 && (
                <div className="home-posts">
                    {posts.map((post)=>(
                        <div key={post._id} className="home-post">
                            <h2>{post.title}</h2>
                            {post.imageUrls && post.imageUrls.map((url, i)=>(
                                <img key={i} src={url} alt={`Post ${i+1}`}/>
                            ))}
                            <p>{post.description}</p>
                            <div className="home-post-options">
                                <div className="home-post-like">
                                    {post.likes.some(like=>like.userId===profile._id) 
                                        ? <img src="/like-active.png" alt="unlike" className="icon" onClick={()=>toggleLike(post._id)}/>
                                        : <img src="/like.png" alt="like" className="icon" onClick={()=>toggleLike(post._id)}/>
                                    }
                                    <p>{post.likesCount}</p>
                                </div>
                                <div className="home-post-comment" onClick={()=>setShowComments(prev=>({postId:post._id, show: prev.postId===post._id ? !prev.show : true}))}>
                                    comments
                                    {showComments.postId===post._id && showComments.show 
                                        ? <img src="/up-arrow.png" alt="up" className="icon"/>
                                        : <img src="/down-arrow.png" alt="down" className="icon"/>
                                    }
                                </div>
                            </div>
                            {showComments.postId===post._id && showComments.show && <p>comments</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}
import { useNavigate } from "react-router-dom";
import "./Add.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import React, { useState } from "react";
import type { PostType } from "../../../types/types";

export default function Add(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();
    const userId=useSelector((state: RootState)=>state.profile._id);
    const [postDetails, setPostDetails]=useState<PostType>({
        title: "",
        description: ""
    });
    const [postImages, setPostImages]=useState<File[]>([]);
    
    function imageInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files){
            const images=Array.from(e.target.files);
            setPostImages(prev=>[...prev, ...images]);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setPostDetails({
            ...postDetails,
            [e.target.name]: e.target.value
        })
    }
    
    async function addPost(e: React.FormEvent){
        e.preventDefault();
        try{
            const formData=new FormData();
            if(userId){
                formData.append("userId", userId);
            }
            else{
                throw new Error("UserId is missing");
            }
            Object.entries(postDetails).forEach(([key, value])=>{
                formData.append(key, value);
            });
            postImages.forEach(image=>{
                formData.append("images", image);
            });

            const response=await fetch(`${apiUrl}/addPost`, {
                method: "POST",
                body: formData,
                credentials: "include"                
            });
            const result=await response.json();
            if(response.ok){
                navigate("/profile");
            }
            console.log(result.message);
        }
        catch(error){
            console.log("Error while adding new post: ", error);
        }
    }

    function removeImage(e: React.MouseEvent, index: number){
        e.preventDefault();
        const updatedImages=postImages.filter((_, i)=>i!=index);
        setPostImages(updatedImages);
    }

    return(
        <form className="add-post-form" onSubmit={addPost}>
            <h1>Add post</h1>
            <div className="add-post-input">
                <label htmlFor="images">Images</label>
                <label htmlFor="images" className="add-post-label-input">Add images</label>
                <input type="file" name="images" id="images" onChange={imageInput} multiple accept="image/*"/>
            </div>
            {postImages.length>0 && 
                <div className="add-post-images">
                    {postImages.map((image, index)=>(
                        <div key={index} className="add-post-image">
                            <img src={URL.createObjectURL(image)} alt="image"/>
                            <button type="button" className="add-post-remove-image" onClick={(e)=>removeImage(e, index)}>
                                <img src="/close.png" alt="close"/>
                            </button>
                        </div>
                    ))}        
                </div>
            }
            <div className="add-post-input">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={postDetails.title} onChange={handleInputChange} required/>
            </div>
            <div className="add-post-input">
                <label htmlFor="desc">Description</label>
                <input type="text" name="description" id="desc" value={postDetails.description} onChange={handleInputChange}/>
            </div>
            <button type="submit" className="add-post-button">Add post</button>
        </form>
    )
}
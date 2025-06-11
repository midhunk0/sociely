/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import socket from "../../../util/socket";
import type { MessageType, UserType } from "../../../types/types";

export default function Chat(){
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const profile=useSelector((state: RootState)=>state.profile);
    const { followings, fetchFollowings }=useFetch();

    const [selected, setSelected]=useState<UserType | null>();
    const [searchUser, setSearchUser]=useState<string>("");
    const [chatId, setChatId]=useState<string>("");
    const [showUsers, setShowUsers]=useState<UserType[]>([]);
    const [message, setMessage]=useState<string>("");
    const [messages, setMessages]=useState<MessageType[]>([]);
    const [width, setwidth]=useState(window.innerWidth);

    useEffect(()=>{
        const handleResize=()=>setwidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    })

    const bottomRef=useRef<HTMLDivElement | null>(null);

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(()=>{
        if(profile._id){
            fetchFollowings(profile._id);
        }
    }, [profile._id]);
    
    useEffect(()=>{
        setShowUsers(followings);
    }, [followings]);

    async function openChat(user: UserType){
        try{
            const response=await fetch(`${apiUrl}/chat/${user._id}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Failed to fetch chat");
            }
            const result=await response.json();
            const chatId=result.chat?._id;
            if(!chatId){
                throw new Error("Chat id is undefined");
            }
            setChatId(chatId);
            setSelected(user)
            socket.emit("joinRoom", chatId);
        }
        catch(error){
            console.log("Failed to open chat: ", error);
        }
    }

    useEffect(()=>{
        if(searchUser.trim()!==""){
            const updatedUsers=followings.filter((user)=>user.username?.includes(searchUser));
            setShowUsers(updatedUsers);
        }
        else{
            setShowUsers(followings);
        }
    }, [searchUser, followings]);

    useEffect(()=>{
        socket.on("receiveMessage", (newMessage: MessageType)=>{
            if(newMessage.chatId===chatId){
                setMessages((prev)=>[...prev, newMessage]);
            }
        })
        return()=>{
            socket.off("receiveMessage");
        }
    }, [chatId]);

    function handleSendMessage(e: React.FormEvent){
        e.preventDefault();
        if(!message.trim()) return;

        if(!profile._id) return;

        const newMessage: MessageType={
            chatId, 
            senderId: profile._id,
            message
        }

        socket.emit("sendMessage", newMessage);
        // setMessages((prev)=>[...prev, newMessage]);
        setMessage("");
    }

    async function fetchMessages(){
        try{
            const response=await fetch(`${apiUrl}/chat/${chatId}`, {
                method: "GET",
                headers: { "Content-type": "application/json" },
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("Failed to fetch messages");
            }
            const result=await response.json();
            setMessages(result.messages);
        }
        catch(error){
            console.log("Error while fetching messages: ", error);
        }
    }

    useEffect(()=>{
        if(chatId){
            fetchMessages();
        }
    }, [chatId]);

    function renderDate(date: Date){
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getUTCFullYear();

        let postFix="";
        if(day > 3 && day < 21) postFix="th";
        switch(day % 10){
            case 1: postFix="st"; break;
            case 2: postFix="nd"; break;
            case 3: postFix="rd"; break;
            default: postFix="th"; break;
        }
        const formattedDate = `${day}${postFix} ${month} ${year}`;
        return formattedDate;
    }

    function renderTime(date: Date){
        let hour=date.getHours();
        const minute=date.getMinutes().toString().padStart(2, "0");
        const postFix=hour>=12 ? "pm" : "am";

        hour=hour%12 || 12;

        const formattedTime=` ${hour}:${minute} ${postFix}`;
        return formattedTime
    }

    function getDateKey(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; // e.g., 2025-4-29
    }


    return(
        <div className="chat">
            {(width>=640 || width<640 && !selected) &&
            <div className="chat-users">
                <h1>chat</h1>
                <div className="chat-users-search">
                    <img src="/search.png" alt="search" className="icon"/>
                    <input type="text" name="searchUser" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearchUser(e.target.value)} placeholder="search user"/>
                </div>
                {showUsers && showUsers.map((user, index)=>(
                    <div className="chat-user" key={index} onClick={()=>openChat(user)}>
                        <img src="/profile.png" alt="profile" className="icon"/>
                        <p>{user.username}</p>
                    </div>
                ))}
            </div>
            }
            {(width>=640 || width<640 && selected) && 
            <div className={`chat-selected ${selected!==null ? "selected" : "unselected"}`}>
                {selected && 
                    <div className="chat-selected-user">
                        <div className="chat-selected-user-header">
                            {width<640 && 
                                <button onClick={()=>setSelected(null)}>
                                    <img src="/left-orange.png" alt="left" className="icon"/>
                                </button>
                            }
                            <p>{selected.username}</p>
                        </div>

                        <div className="chat-selected-user-messages">
                            {messages && (()=>{
                                const renderedDates=new Set<string>();
                                
                                return messages.map((item, index)=>{
                                    if(!item.timestamp) return;
                                    const dateObj=new Date(item.timestamp);
                                    const dateKey=getDateKey(dateObj);
                                    const isNewDate=!renderedDates.has(dateKey);

                                    if (isNewDate){
                                        renderedDates.add(dateKey);
                                    }

                                    return (
                                        <div key={index} className="chat-selected-user-message">
                                            {isNewDate && 
                                                <p className="chat-date-header">{renderDate(dateObj)}</p>
                                            }
                                            <div>
                                                {item.senderId !== profile._id && <div className="chat-receiver-cone"/>}
                                                <div className={`${item.senderId === profile._id ? "chat-send-message" : "chat-receive-message"}`}>
                                                    <p className="chat-message">{item.message}</p>
                                                    <p className="chat-time">{renderTime(dateObj)}</p>
                                                </div>
                                                {item.senderId === profile._id && <div className="chat-sender-cone"/>}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                            <div ref={bottomRef}/>
                        </div>
                        <form className="chat-selected-user-input" onSubmit={handleSendMessage}>
                            <input type="text" autoComplete="off" name="message" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter message..."/>
                            <button type="submit">
                                <img src="/send.png" alt="send" className="icon"/>
                            </button>
                        </form>
                    </div>
                }
            </div>
            }
        </div>
    )
}
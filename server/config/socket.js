const { Message } = require("../models/model");

module.exports=function(io){
    io.on("connection", (socket)=>{
        console.log("User connected: ", socket.id);

        socket.on("joinRoom", (chatId)=>{
            socket.join(chatId);
        });

        socket.on("sendMessage", async({ chatId, senderId, message })=>{
            console.log(chatId, senderId, message);
            const newMessage=await Message.create({ chatId, senderId, message });
            io.to(chatId).emit("receiveMessage", newMessage);
        });

        socket.on("disconnect", ()=>{
            console.log("User disconnected: ", socket.id);
        });
    })
}
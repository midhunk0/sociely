// @ts-nocheck
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const router=require("./routes/route");
const dotenv=require("dotenv").config();
const cookieParser=require("cookie-parser");
const multer=require("multer");
const http=require("http");
const { Server }=require("socket.io");
const socket=require("./config/socket");

const port=8000;
const app=express();
const server=http.createServer(app);
const io=new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Database is connected!"))
    .catch((error)=>{console.log("Database is not connected", error)})

app.use("/", router);
socket(io);

server.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})
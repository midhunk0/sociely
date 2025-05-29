const mongoose=require("mongoose");

const userRefSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
}, { timestamps: true, _id: false });

const chatSchema=new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const messageSchema=new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: { 
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const commentsSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    replies: [{ 
        type: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }], 
        default: [] 
    }]
}, { timestamps: true});

const postSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    postImages: [{ 
        imageName: String,
        imageType: String,
        image: Buffer,
    }],
    likesCount: { 
        type: Number, 
        default: 0 
    },
    likes: { 
        type: [userRefSchema], 
        default: [] 
    },
    comments: { 
        type: [commentsSchema], 
        default: [] 
    }
}, { timestamps: true });

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    profileImage: {
        imageName: String,
        imageType: String,
        image: Buffer
    },
    verified:{
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    followers: { 
        type: [userRefSchema], 
        default: [] 
    },
    followings: { 
        type: [userRefSchema], 
        default: [] 
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post" 
    }]
}, { timestamps: true });

const User=mongoose.model("User", userSchema);
const Post=mongoose.model("Post", postSchema);
const Chat=mongoose.model("Chat", chatSchema);
const Message=mongoose.model("Message", messageSchema);
module.exports={ User, Post, Chat, Message };
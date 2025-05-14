const mongoose=require("mongoose");

const userRefSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
}, { timestamps: true, _id: false });

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
}, { timestamps: true, _id: false });

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
    image: { 
        type: String, 
        required: true 
    },
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
    followers: { 
        type: [userRefSchema], 
        default: [] 
    },
    followings: { 
        type: [userRefSchema], 
        default: [] 
    },
    posts: { 
        type: [postSchema], 
        default: [] 
    }
}, { timestamps: true });

const User=mongoose.model("User", userSchema);
module.exports=User;
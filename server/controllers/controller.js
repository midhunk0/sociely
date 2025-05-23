const { hashPassword, generateToken, comparePassword } = require("../config/auth");
const sendEmail = require("../config/mail");
const { User, Post } = require("../models/model");

const generateOTP=()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}

async function registerUser(req, res){
    try{
        const { name, username, password, email }=req.body;
        if(!name || !username || !password || !email){
            return res.status(400).json({ message: "All entries are required" });
        }
        const usernameExist=await User.findOne({ username });
        if(usernameExist){
            return res.status(400).json({ message: "This username is taken" });
        }
        const emailExist=await User.findOne({ email });
        if(emailExist){
            return res.status(400).json({ message: "This email has already a user" });
        }
        const hashedPassword=await hashPassword(password);
        const otp=generateOTP();
        const otpExpires=new Date(Date.now()+10*60*1000);
        const user=new User({ 
            name, 
            username, 
            email, 
            password: hashedPassword,
            otp,
            otpExpires,
        });
        await user.save();
        const message=`Your verification code is: ${otp}`;
        await sendEmail(email, "Verify your email", message);
        const token=generateToken(user._id);
        res.cookie("auth", 
            token, { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
        return res.status(200).json({ message: "User register successful", token, email });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function sendOTP(req, res){
    try{
        const { email }=req.body;
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        const user=await User.findOne({ email: email }).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const otp=generateOTP();
        const otpExpires=new Date(Date.now()+10*60*1000);
        user.otp=otp;
        user.otpExpires=otpExpires;
        await user.save();
        const message=`Your verification code is: ${otp}`;
        await sendEmail(email, "Verify your email", message);
        return res.status(200).json({ message: "OTP sends to email", email });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function verifyOTP(req, res){
    try{
        const { email, otp }=req.body;
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        if(!otp){
            return res.status(400).json({ message: "OTP is required" });
        }
        const user=await User.findOne({ email: email }).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        if(user.otp!==otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // @ts-ignore
        if(user.otpExpires<Date.now()){
            return res.status(400).json({ message: "OTP expired" });
        }
        user.verified=true;
        user.otp=undefined;
        user.otpExpires=undefined;
        await user.save();
        const token=generateToken(user._id);
        res.cookie("auth", 
            token, { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
        return res.status(200).json({ message: "User verified successfully", verified: true });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function loginUser(req, res){
    try{
        const { credential, password }=req.body;
        if(!credential || !password){
            return res.status(400).json({ message: "All entries are required" });
        }
        const user=await User.findOne({ $or: [{ email: credential }, { username: credential }] });
        if(!user){
            return res.status(400).json({ message: "User doesn't exists" });
        }
        const passwordMatch=await comparePassword(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }
        if(!user.verified){
            if(!user.otp || !user.otpExpires || user.otpExpires.getTime()<Date.now()){
                const otp=generateOTP();
                user.otp=otp;
                user.otpExpires=new Date(Date.now()+10*60*1000);
                await user.save();
                const message=`Your verification code is: ${otp}`;
                await sendEmail(user.email, "Verify your email", message);
                return res.status(200).json({ message: "New OTP send", verified: false, email: user.email });
            }
            return res.status(200).json({ message: "You are not verified", verified: false, email: user.email });
        }
        user.otp=undefined;
        user.otpExpires=undefined;
        await user.save();
        const token=generateToken(user._id);
        res.cookie("auth", 
            token, { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
        return res.status(200).json({ message: "User login successful", token, verified: true });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function logoutUser(_, res){
    try{
        res.cookie("auth", 
            "", { 
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: new Date(0)
            }
        );
        return res.status(200).json({ message: "Logout successful" });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function updateUser(req, res){
    try{
        const userId=req.user.userId;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { name, username, oldPassword, newPassword, email }=req.body;
        let otpRequired=false;
        if(username && username!==user.username){
            const usernameExist=await User.findOne({ username });
            if(usernameExist){
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username=username;
            otpRequired=true;
        }
        if(email && email!==user.email){
            const emailExist=await User.findOne({ email });
            if(emailExist){
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email=email;
            otpRequired=true;
        }
        if(oldPassword && newPassword){
            const passwordMatch=await comparePassword(oldPassword, user.password);
            if(!passwordMatch){
                return res.status(400).json({ message: "Incorrect password" });
            }
            if(oldPassword===newPassword){
                return res.status(400).json({ message: "New password cannot be the same as the old password" });
            }
            user.password=await hashPassword(newPassword);
            otpRequired=true;
        }
        if(name && name!==user.name){
            user.name=name;
            otpRequired=true;
        }
        if(otpRequired){
            const otp=generateOTP();
            user.otp=otp;
            user.otpExpires=new Date(Date.now()+10*60*1000);
            user.verified=false;
            const message=`Your verification code is: ${otp}`;
            await sendEmail(user.email, "Verify your email", message);
        }
        await user.save();
        if(otpRequired){
            res.cookie("auth", 
                "", { 
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    expires: new Date(0)
                }
            );
        }
        return res.status(200).json({ 
            message: otpRequired ? "User updated. Check your email for the verification OTP" : "User updated", 
            verified: !otpRequired, 
            ...(otpRequired && { email: user.email }) 
        });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchProfile(req, res){
    try{
        const userId=req.user.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User profile fetched", user });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function searchUser(req, res){
    try{
        const { identifier }=req.body;
        if(!identifier){
            return res.status(400).json({ message: "Username or name is required" });
        }
        const users=await User.find({ 
            $or: [
                { username: { $regex: identifier, $options: "i" }}, 
                { name: { $regex: identifier, $options: "i" }}
            ] 
        }).select("-password");
        if(!users || users.length===0){
            return res.status(400).json({ message: "User not found", users: [] });
        }
        return res.status(200).json({ message: "Users found", users });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchUser(req, res){
    try{
        const { username }=req.params;
        if(!username){
            return res.status(400).json({ message: "Username is required" });
        }
        const user=await User.findOne({ username }).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User found", user });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function toggleFollowUser(req, res){
    try{
        const { userId }=req.params;
        if(!userId){
            return res.status(400).json({ message: "UserId is required" });
        }
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const profileUserId=req.user.userId;
        const profileUser=await User.findById(profileUserId).select("-password");
        if(!profileUser){
            return res.status(400).json({ message: "Profile user not found" });
        }
        const isFollowing=profileUser.followings.find(user=>user.userId.toString()===userId);
        if(isFollowing){
            profileUser.followings.pull({ userId });
            user.followers.pull({ userId: profileUserId });
        }
        else{
            profileUser.followings.push({ userId });
            user.followers.push({ userId: profileUserId });
        }
        await profileUser.save();
        await user.save();
        return res.status(200).json({ message: isFollowing ? "Unfollowed user" : "Followed user" });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchFollowers(req, res){
    try{
        const { userId }=req.params;
        const user=await User.findById(userId).populate({
            path: "followers.userId",
            select: "username name _id"
        });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const followers=user.followers.map(follower=>follower.userId);
        return res.status(200).json({ followers });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchFollowings(req, res){
    try{
        const { userId }=req.params;
        const user=await User.findById(userId).populate({
            path: "followings.userId",
            select: "username name _id"
        });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const followings=user.followings.map(following=>following.userId);
        return res.status(200).json({ followings });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function addPost(req, res){
    const userId=req.user.userId;
    const user=await User.findById(userId);
    if(!user){
        return res.status(400).json({ message: "User not found" });
    }
    const { title, description }=req.body;
    if(!title){
        return res.status(400).json({ message: "Title is required for the post" });
    }
    if(!description){
        return res.status(400).json({ message: "Description is required for the post" });
    }
    let postImages;
    if(Array.isArray(req.files)){
        postImages=req.files.map((image)=>({
            imageName: `${Date.now()}-${image.originalname}`,
            imageType: image.mimetype,
            image: image.buffer
        }));
    }
    const post=new Post({
        userId,
        title,
        description,
        postImages
    });
    user.posts.push(post._id);
    await user.save();
    await post.save();
    return res.status(200).json({ message: "Post added successfully" });
}

async function fetchImage(req, res){
    try{
        const { postId, imageIndex }=req.params;
        console.log(postId, imageIndex);
        const index=parseInt(imageIndex);
        if(isNaN(index) || index<0){
            return res.status(400).json({ message: "Invalid image index" });
        }
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({ message: "Post not found" });
        }
        const image=post.postImages[index];
        if(!image){
            return res.status(400).json({ message: "Image not found" });
        }
        res.set("Content-Type", image.imageType || "application/octet-stream");
        return res.send(image.image);
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchPost(req, res){
    try{
        const apiUrl=process.env.API_URL;
        const { postId }=req.params;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({ message: "Post not found" });
        }
        const imageUrls=post.postImages.map((_, index)=>`${apiUrl}/fetchImage/${postId}/${index}`);
        const { postImages, ...postData }=post.toObject();
        const postWithImages={
            ...postData,
            imageUrls
        }
        return res.status(200).json({ message: "Post fetched successfully", posts: postWithImages });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function fetchPosts(req, res){
    try{
        const apiUrl=process.env.API_URL;
        const { userId }=req.params;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const postsWithImages=await Promise.all(user.posts.map(async(post)=>{
            const postWithDetails=await Post.findById(post._id);
            if(!postWithDetails){
                return res.status(400).json({ message: "Post not found" });
            }
            const imageUrls=postWithDetails.postImages.map((_, index)=>`${apiUrl}/fetchImage/${post._id}/${index}`);
            const { postImages, ...postData }=postWithDetails.toObject();
            return{
                ...postData,
                imageUrls
            }
        }));
        return res.status(200).json({ message: "Posts fetched", posts: postsWithImages });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function editPost(req, res){

}

async function deletePost(req, res){

}

async function toggleLike(req, res){

}

async function addComment(req, res){

}

async function editComment(req, res){

}

async function deleteComment(req, res){

}

async function deleteUser(req, res){
    try{
        const userId=req.user.userId;
        if(!userId){
            return res.status(400).json({ message: "UserId is required" });
        }
        const userDeleted=await User.findByIdAndDelete(userId);
        if(!userDeleted){
            return res.status(400).json({ message: "User not deleted" });
        }
        res.cookie("auth", 
            "", { 
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: new Date(0)
            }
        );
        return res.status(200).json({ message: "User deleted" });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

module.exports={
    registerUser,
    sendOTP,
    verifyOTP,
    loginUser,
    logoutUser,
    updateUser,
    fetchProfile,
    searchUser,
    fetchUser,
    toggleFollowUser,
    fetchFollowers,
    fetchFollowings,
    addPost,
    fetchImage,
    fetchPost,
    fetchPosts,
    editPost,
    deletePost,
    toggleLike,
    addComment,
    editComment,
    deleteComment,
    deleteUser
}
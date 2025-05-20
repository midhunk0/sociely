const { hashPassword, generateToken, comparePassword } = require("../config/auth");
const User = require("../models/model");

async function register(req, res){
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
        const user=new User({ name, username, email, password: hashedPassword });
        await user.save();
        const token=generateToken(user._id);
        res.cookie("auth", 
            token, { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
        return res.status(200).json({ message: "User register successful", token });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function login(req, res){
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
        const token=generateToken(user._id);
        res.cookie("auth", 
            token, { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
        return res.status(200).json({ message: "User login successful", token });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function logout(_, res){
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

module.exports={
    register,
    login,
    logout,
    fetchProfile,
    searchUser,
    fetchUser,
    toggleFollowUser,
    fetchFollowers,
    fetchFollowings
}
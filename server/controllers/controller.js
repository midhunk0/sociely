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
        const user=await User.findOne({ $or: [{ email: credential }, { username: credential }]});
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

module.exports={
    register,
    login,
    logout,
    fetchProfile
}
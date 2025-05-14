// @ts-nocheck
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();

const JWT_SECRET=process.env.JWT_SECRET;

function generateToken(userId){
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
}

async function hashPassword(password){
    const saltRounds=10;
    try{
        const salt=await bcrypt.genSalt(saltRounds);
        const hashedPassword=await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    catch(error){
        throw error;
    }
}

async function comparePassword(password, hashedPassword){
    try{
        const match=await bcrypt.compare(password, hashedPassword);
        return match;
    }
    catch(error){
        throw error;
    }
}

module.exports={
    generateToken, 
    verifyToken, 
    hashPassword, 
    comparePassword
}
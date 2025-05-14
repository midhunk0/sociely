const express=require("express");
const router=express.Router();
const { register, login, logout, fetchProfile }=require("../controllers/controller");
const authMiddleware=require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.put("/logout", logout);
router.get("/fetchProfile", authMiddleware, fetchProfile);

module.exports=router;
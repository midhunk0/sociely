const express=require("express");
const router=express.Router();
const { register, login, logout, fetchProfile, searchUser, fetchUser }=require("../controllers/controller");
const authMiddleware=require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.put("/logout", logout);
router.get("/fetchProfile", authMiddleware, fetchProfile);
router.post("/searchUser", authMiddleware, searchUser);
router.get("/fetchUser/:username", authMiddleware, fetchUser);

module.exports=router;
const express=require("express");
const router=express.Router();
const { register, login, logout, fetchProfile, searchUser, fetchUser, toggleFollowUser, fetchFollowers, fetchFollowings }=require("../controllers/controller");
const authMiddleware=require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.put("/logout", logout);
router.get("/fetchProfile", authMiddleware, fetchProfile);
router.post("/searchUser", authMiddleware, searchUser);
router.get("/fetchUser/:username", authMiddleware, fetchUser);
router.put("/toggleFollowUser/:userId", authMiddleware, toggleFollowUser);
router.get("/fetchFollowers/:userId", authMiddleware, fetchFollowers);
router.get("/fetchFollowings/:userId", authMiddleware, fetchFollowings);

module.exports=router;
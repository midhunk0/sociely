const express=require("express");
const router=express.Router();
const { registerUser, loginUser, logoutUser, fetchProfile, searchUser, fetchUser, toggleFollowUser, fetchFollowers, fetchFollowings, deleteUser, updateUser, addPost, editPost, deletePost, toggleLike, addComment, editComment, deleteComment, sendOTP, verifyOTP, fetchImage, fetchPost, fetchPosts }=require("../controllers/controller");
const authMiddleware=require("../middlewares/auth");
const upload = require("../config/multer");

router.post("/registerUser", upload.single("image"), registerUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/loginUser", loginUser);
router.put("/logoutUser", logoutUser);
router.put("/updateUser", upload.single("image"), authMiddleware, updateUser);
router.get("/fetchProfile", authMiddleware, fetchProfile);
router.post("/searchUser", authMiddleware, searchUser);
router.get("/fetchUser/:username", authMiddleware, fetchUser);
router.put("/toggleFollowUser/:userId", authMiddleware, toggleFollowUser);
router.get("/fetchFollowers/:userId", authMiddleware, fetchFollowers);
router.get("/fetchFollowings/:userId", authMiddleware, fetchFollowings);
router.post("/addPost", upload.array("images"), authMiddleware, addPost);
router.get("/fetchImage/:postId/:imageIndex", authMiddleware, fetchImage);
router.get("/fetchPost/:postId", authMiddleware, fetchPost);
router.get("/fetchPosts/:userId", authMiddleware, fetchPosts);
router.put("/editPost/:postId", upload.array("images"), authMiddleware, editPost);
router.delete("/deletePost/:postId", authMiddleware, deletePost);
router.put("/toggleLike/:postId", authMiddleware, toggleLike);
router.post("/addComment/:postId", authMiddleware, addComment);
router.put("/editComment/:commentId", authMiddleware, editComment);
router.delete("/deleteComment/:commentId", authMiddleware, deleteComment);

router.delete("/deleteUser", authMiddleware, deleteUser);

module.exports=router;
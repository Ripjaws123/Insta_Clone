import express from "express";
import isVerified from "../middleware/isVerified.js";
import upload from "../middleware/multerConfig.js";
import {
  addcommentPost,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePosts,
  getAllComments,
  getAllPosts,
  getUserPosts,
  likePosts,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/addpost", upload.single("image"), isVerified, addNewPost);
router.get("/getpost/all",isVerified, getAllPosts);
router.get("/userpost/all", isVerified, getUserPosts);
router.get("/:id/likepost", isVerified, likePosts);
router.get("/:id/dislikepost", isVerified, dislikePosts);
router.post("/:id/comment", isVerified, addcommentPost);
router.get("/:id/comment/all",isVerified, getAllComments);
router.delete("/:id/deletepost", isVerified, deletePost);
router.get("/:id/bookmarkpost", isVerified, bookmarkPost);

export default router;
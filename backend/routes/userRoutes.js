import express from "express";
import isVerified from "../middleware/isVerified.js";
import {
  editProfile,
  followUser,
  getProfile,
  login,
  logout,
  register,
  suggestedUser,
} from "../controllers/userController.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/register", register); //register Successfully Working
router.post("/login", login); //login Successfully Working
router.get("/logout", logout); //logout Successfully Working
router.get("/:id/profile", isVerified, getProfile); //getProfile Successfully Working
router.post(
  "/profile/edit",
  isVerified,
  upload.fields([
    { name: "profilepicture", maxCount: 1 },
    { name: "coverpicture", maxCount: 1 },
  ]),
  editProfile
); //editProfile Successfully Working
router.get("/suggestuser", isVerified, suggestedUser); //suggestedUser Successfully Working
router.post("/followunfollow/:id", isVerified, followUser); //followUser Successfully Working

export default router;
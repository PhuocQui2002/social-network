import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  getAllUser,
  SearchUser,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/:id").get(isAuthenticated, getProfile);
router.route("/getAllUser").get(isAuthenticated, getAllUser);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/getSuggestedUsers").get(isAuthenticated, getSuggestedUsers);
router.route("/followOrUnfollow/:id").post(isAuthenticated, followOrUnfollow);
router.route("/SearchUser").get(isAuthenticated, SearchUser);


export default router;

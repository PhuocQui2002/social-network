import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  createPost,
  getAllPost,
  getUserPost,
  deletePost,
  likePost,
  dislikePost,
} from "../controllers/postController.js";

const router = express.Router();

router
  .route("/createPost")
  .post(isAuthenticated, upload.single("image"), createPost);
router.route("/getAllPost").get(isAuthenticated, getAllPost);
router.route("/getUserPost").get(isAuthenticated, getUserPost);
router.route("/like/:id").get(isAuthenticated, likePost);
router.route("/dislike/:id").get(isAuthenticated, dislikePost);
router.route("/deletePost/:id").delete(isAuthenticated, deletePost);


export default router;

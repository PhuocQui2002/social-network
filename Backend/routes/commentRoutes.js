import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  getCommentsOfPost,
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/commentCreat/:id").post(isAuthenticated, addComment);
router.route("/commenAll/:id").post(isAuthenticated, getCommentsOfPost);

export default router;



import { Post } from "../Models/postModel.js";
import { Comment } from "../Models/commentModel.js";

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userIdComment = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: userIdComment,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    const postOwnerId = String(post.author);


    if (postOwnerId !== userIdComment) {
      //  notification event
      const notification = {
        type: "like",
        userId: userIdLike,
        userDetails: user,
        post,
        message: "Your post was liked",
      };
    }

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

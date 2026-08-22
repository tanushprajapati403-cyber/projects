import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res.status(400).json({
        success: false,
        message: "both field are required",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    const comment = await CommentModel.create({
      text,
      post: postId,
      user: req.user.id,
    });

    post.comments.push(comment._id);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "comment created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }

    const post = await PostModel.findById(postId).popoulate({
      path: "comments",
      popoulate: {
        path: "user",
        select: "username profile_pic",
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "comments fetched successfully",
      comments: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const { updatedText } = req.body;

    if (!commentId || !updatedText) {
      return res.status(400).json({
        success: false,
        message: "comment id and text is required",
      });
    }

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "comment not found",
      });
    }
    if (!(String(comment.user) === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "forbidden",
      });
    }

    comment.text = updatedText;
    
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "comment updated successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};



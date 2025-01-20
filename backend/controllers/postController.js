import sharp from "sharp";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import cloudinary from "../utilities/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// <---------------------------------------------Add New Post----------------------------------------------->
export const addNewPost = async (req, res) => {
  try {
    // Fetching the Details
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    // Validating the Fields
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is Required",
      });
    }

    // image Resizer
    const resizeImage = await sharp(image.buffer)
      .resize({
        width: 600,
        height: 600,
        fit: "cover",
        position: "center",
      })
      .toFormat("jpeg", {
        quality: 90,
      })
      .toBuffer();

    // converting the image to data uri
    const fileuri = `data:image/jpeg;base64,${resizeImage.toString("base64")}`;
    // Uploading to cloud
    const cloudinaryResponse = await cloudinary.uploader.upload(fileuri);

    // Creating the Post
    const newPost = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: authorId,
    });

    // Saving the Post
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    await newPost.populate({
      path: "author",
      select: "-password",
    });

    user.password = undefined;
    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "New Post Created Successfully",
      post: newPost,
      user,
    });
  } catch (error) {
    console.log("Error While Adding New Post", error);
    return res.status(500).json({
      success: false,
      message: "Error While Adding New Post",
    });
  }
};

// <---------------------------------------------Get All Posts----------------------------------------------->
export const getAllPosts = async (req, res) => {
  try {
    // Fetching the Posts
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePic",
        },
      });

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "Posts Fetched Successfully",
      posts,
    });
  } catch (error) {
    console.log("Error While Fetching the Posts", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching the Posts",
    });
  }
};

// <---------------------------------------------Get user Post----------------------------------------------->
export const getUserPosts = async (req, res) => {
  try {
    // Fetching the User Posts
    const userId = req.id;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePic",
        },
      });

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "User Posts Fetched Successfully",
      posts,
    });
  } catch (error) {
    console.log("Error While Fetching the User Posts", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching the User Posts",
    });
  }
};

// <---------------------------------------------Like Post----------------------------------------------->
export const likePosts = async (req, res) => {
  try {
    // Fetching the Post
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // Likes the Post
    await post.updateOne({
      $addToSet: {
        likes: userId,
      },
    });
    await post.save();

    // sending the notifiction to the user
    const user = await User.findById(userId).select("username profilePic");
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetails: user,
        postId,
        message: `${user.username} liked your post`,
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "Post Liked Successfully",
    });
  } catch (error) {
    console.log("Error While liking the Post", error);
    return res.status(500).json({
      success: false,
      message: "Error While liking the Post",
    });
  }
};

// <---------------------------------------------UnLike Post----------------------------------------------->
export const dislikePosts = async (req, res) => {
  try {
    // Fetching the Post
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // Likes the Post
    await post.updateOne({
      $pull: {
        likes: userId,
      },
    });
    await post.save();

    // sending the notifiction to the user
    const user = await User.findById(userId).select("username profilePic");
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: `${user.username} disliked your post`,
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "Post disLiked Successfully",
    });
  } catch (error) {
    console.log("Error While disliking the Post", error);
    return res.status(500).json({
      success: false,
      message: "Error While disliking the Post",
    });
  }
};

// <---------------------------------------------Comment on Post----------------------------------------------->
export const addcommentPost = async (req, res) => {
  try {
    // Fetching the Details
    const userId = req.id;
    const postId = req.params.id;

    const { text } = req.body;

    // Validating the Details
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Enter the Comments",
      });
    }

    // Fetching the Post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // Adding the Comment
    const newComment = await new Comment({
      text,
      author: userId,
      post: postId,
    }).populate({
      path: "author",
      select: "username profilePic",
    });

    post.comments.push(newComment._id);

    // Saving the Comment
    await Promise.all([post.save(), newComment.save()]);

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "Comment Added Successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log("Error While Commenting on Post", error);
    return res.status(500).json({
      success: false,
      message: "Error While Commenting on Post",
    });
  }
};

// <---------------------------------------------Get All Comments on Post----------------------------------------------->
export const getAllComments = async (req, res) => {
  try {
    // Fetching the Comments
    const postId = req.params.id;

    const comment = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username, profilePic",
    });

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "No Comments Found",
      });
    }

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "All Comments Fetched Successfully",
      comments: comment,
    });
  } catch (error) {
    console.log("Error While Fetching the Comments", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching the Comments on Post",
    });
  }
};

// <---------------------------------------------Delete Post----------------------------------------------->
export const deletePost = async (req, res) => {
  try {
    // Fetching the Post
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // Checking if the User is the Author of the Post
    if (post.author.toString() !== authorId) {
      return res.status(400).json({
        success: false,
        message: "You are not the Author of the Post",
      });
    }

    // Deleting the Post
    await Post.findByIdAndDelete(postId);

    // Updating the User
    const user = await User.findById(authorId).select("-password");
    user.posts.pull(postId);
    await user.save();

    // Deleting the Comments
    await Comment.deleteMany({ post: postId });

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
      user,
    });
  } catch (error) {
    console.log("Error while Deleting the Post", error);
    return res.status(500).json({
      success: false,
      message: "Error while Deleting the Post",
    });
  }
};

// <---------------------------------------------Bookmark Post----------------------------------------------->
export const bookmarkPost = async (req, res) => {
  try {
    // Fetching the Post
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Checking if the Post is already Bookmarked
    if (user.bookmarks.includes(post._id)) {
      //   Unbookmark the Post
      await user.updateOne({
        $pull: {
          bookmarks: post._id,
        },
      });

      await user.save();

      const updatedUser = await User.findById(authorId).select("-password");

      return res.status(200).json({
        success: true,
        message: "Post UnBookmarked Successfully",
        user: updatedUser,
      });
    } else {
      // Bookmark the Post
      await user.updateOne({
        $addToSet: {
          bookmarks: post._id,
        },
      });

      await user.save();

      const updatedUser = await User.findById(authorId).select("-password");

      return res.status(200).json({
        success: true,
        message: "Post Bookmarked Successfully",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.log("Error while Bookmarking the Post", error);
    return res.status(500).json({
      success: false,
      message: "Error while Bookmarking the Post",
    });
  }
};

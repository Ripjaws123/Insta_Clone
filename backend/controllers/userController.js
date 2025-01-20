import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utilities/dataUri.js";
import cloudinary from "../utilities/cloudinary.js";
import { Post } from "../models/postModel.js";

// <----------------------------------------------Register----------------------------------------------->
export const register = async (req, res) => {
  try {
    // fetching the Details
    const { username, email, password } = req.body;

    //Validating the Fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill All the Fields",
      });
    }

    // Checking if the User Already Exists
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists with this Email",
      });
    }

    // Creating the Password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Creating the User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log("Error While Registering the User", error);
    return res.status(401).json({
      success: false,
      message: "Error While Registering the User",
    });
  }
};

// <---------------------------------------------Login----------------------------------------------->
export const login = async (req, res) => {
  try {
    // Fetching the Details
    const { email, password } = req.body;

    // validating the Fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill All the Fields",
      });
    }

    // Checking if the User Exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Does Not Exists",
      });
    }

    // Comparing thr Password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Credentials",
      });
    }

    // Creating the Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Populating the Post
    const userId = user._id;
    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post?.author.equals(userId)) {
          return post;
        } else {
          return null;
        }
      })
    );

    // Sending the modified user
    user.password = undefined;
    user.posts = populatedPost.filter(Boolean);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${user.username}`,
        user,
      });
  } catch (error) {
    console.log("Error While Logging in User", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error 'While Logging in User'",
    });
  }
};

// <---------------------------------------------Logout----------------------------------------------->
export const logout = (req, res) => {
  try {
    return res
      .cookie("token", null, {
        maxAge: 0,
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    console.log("Error While Logout", error);
    return res.status(401).json({
      success: false,
      message: "Error While Logout",
    });
  }
};

// <---------------------------------------------Get User----------------------------------------------->
export const getProfile = async (req, res) => {
  // Fetching the User
  const userId = req.params.id;

  // Fetching the User
  const user = await User.findById(userId)
    .populate({ path: "posts", createdAt: -1 })
    .populate("bookmarks");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User Not Found",
    });
  }

  // Sending the User
  user.password = undefined;
  return res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    user,
  });
};

// <---------------------------------------------Edit User----------------------------------------------->
export const editProfile = async (req, res) => {
  try {
    // Fetching the id
    const userId = req.id;
    const { bio, gender } = req.body;
    const files = req.files;

    console.log(req.files);

    let profileResponse;
    let coverResponse;

    // Uploading the Profile files
    if (files && files.profilepicture) {
      const fileUri = getDataUri(files.profilepicture[0]);
      console.log(fileUri);

      try {
        profileResponse = await cloudinary.uploader.upload(fileUri.content);
      } catch (error) {
        console.log("Error While Uploading the Profile Picture", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
        });
      }
    }

    // Uploading the Cover files
    if (files && files.coverpicture) {
      const fileUri = getDataUri(files.coverpicture[0]);
      try {
        coverResponse = await cloudinary.uploader.upload(fileUri.content);
      } catch (error) {
        console.log("Error While Uploading the cover Picture", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload cover picture",
        });
      }
    }

    // Fetching the User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Update the User
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profileResponse) user.profilePic = profileResponse.secure_url;
    if (coverResponse) user.coverPic = coverResponse.secure_url;

    // Saving the User
    await user.save();

    // Sending the User
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log("Error While Editing the User", error);
    return res.status(500).json({
      success: false,
      message: "Error While Editing the User",
    });
  }
};

// <---------------------------------------------Suggested User----------------------------------------------->
export const suggestedUser = async (req, res) => {
  try {
    // Fetching the id
    const userId = req.id;

    // Fetching the User
    const suggestedUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");
    if (!suggestedUsers) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Sending the User
    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("Error While Editing the User", error);
    return res.status(401).json({
      success: false,
      message: "Error While Editing the User",
    });
  }
};

// <---------------------------------------------Follow and Unfollow User----------------------------------------------->
export const followUser = async (req, res) => {
  try {
    // Fetching the id
    const LoginUser = req.id;
    const FollowUser = req.params.id;

    if (LoginUser === FollowUser) {
      return res.status(401).json({
        success: false,
        message: "You Cannot Follow Yourself",
      });
    }

    // Fetching the User
    const [LogedInUser, FollowedUser] = await Promise.all([
      User.findById(LoginUser),
      User.findById(FollowUser),
    ]);

    if (!LogedInUser || !FollowedUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Follow the User
    const isFollowed = LogedInUser.followings.includes(FollowUser);
    if (isFollowed) {
      // Unfollow the User
      await Promise.all([
        // Removing the User from followings
        User.updateOne(
          {
            _id: LoginUser,
          },
          {
            $pull: {
              followings: FollowUser,
            },
          }
        ),
        // Removing the Following User from followers
        User.updateOne(
          {
            _id: FollowUser,
          },
          {
            $pull: {
              followers: LoginUser,
            },
          }
        ),
      ]);

      const updatedLogedInUser = await User.findById(LoginUser)
        .select("-password")

      //   Sending the Response
      return res.status(200).json({
        success: true,
        message: `You Unfollowed @${FollowedUser.username}`,
        user: {
          type: "unfollow",
          userDetails: updatedLogedInUser,
        },
      });
    } else {
      // Follow the User
      await Promise.all([
        // Adding the User in followings
        User.updateOne(
          {
            _id: LoginUser,
          },
          {
            $addToSet: {
              followings: FollowUser,
            },
          }
        ),
        // Adding the Following User in followers
        User.updateOne(
          {
            _id: FollowUser,
          },
          {
            $addToSet: {
              followers: LoginUser,
            },
          }
        ),
      ]);

      const updatedLogedInUser = await User.findById(LoginUser)
        .select("-password")

      //   Sending the Response
      return res.status(200).json({
        success: true,
        message: `You Followed @${FollowedUser.username} `,
        user: {
          type: "follow",
          userDetails: updatedLogedInUser,
        },
      });
    }
  } catch (error) {
    console.log("Error while Following or Unfollowing the User", error);
    return res.status(500).json({
      success: false,
      message: "Error while Following or Unfollowing the User",
    });
  }
};

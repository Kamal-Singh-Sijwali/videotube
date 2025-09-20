import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating refresh and access tocken"
    );
  }
};
//============ Register user ===========
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validate -not empty
  // check if user already exist: username, email
  // check for image, check for avatar
  // upload them to cloudinary
  // create user object - create entry in DB
  // remove password and refreshToken field from response
  // check for user creation
  // return res

  const { username, email, fullName, password } = req.body;
  // console.log("email", email);

  // ------ this type of if else for beginners -------------
  //    if(fullName===""){
  //     throw new apiError(400,"Username is required")
  //    } //

  if ([fullName, username, email, password].some((val) => val?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("******* ********",existedUser)
  if (existedUser) {
    throw new apiError(409, "User name or email already existed");
  }
  // console.log("req file==>",req.files)
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(402, "Avatar is required");
  }

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  console.log("coverimage=>", coverImageLocalPath);

  const avatar = await uploadOncloudinary(avatarLocalPath);
  const coverImage = await uploadOncloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || null,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

//============ Login user ===========
const loginUser = asyncHandler(async (req, res) => {
  // req body => data
  // username or email
  // find user
  // password check
  // access and refresh token
  // send cookie

  const { username, email, password } = req.body;
  console.log("**** user ",req)

  if (!email) {
    throw new apiError(400, "Username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("*******login user",user)

  if (!user) {
    throw new apiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(400, "Password incorrect");
  }

  const { accesstoken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // modify cookie only from server so we create option object
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accesstoken, // may bwe user saving access/refresh token in frontend
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

//============ Logout user ===========
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

// ========= refresh access token ==========
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await user.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accesstoken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accesstoken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accesstoken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});

// ============ change password = ===========
const changePasssword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log("**********",oldPassword,newPassword)

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(401, "invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password change successfully"));
});

// ============ Current user ==============

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "current user fetched successfully"));
});

// =============== update account deatils ===============

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log("*******upadte account",fullName,email)
  if (!fullName || !email) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"));
});

// --------------- Avatar update  ===================
// delete avatar after successfully update

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOncloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new apiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  );

  return res.status(200).json(new apiResponse(200, user, "Avatar updated"));
});

// ============ update user cover image ===========

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;

  if (!coverLocalPath) {
    throw new apiError(400, "Cover image is missing");
  }

  const coverImage = await uploadOncloudinary(coverLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "cover image updated"));
});

// ============ user channel profile + aggregate ==============

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new apiError(400, "Channel name is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "channel", // to get subscribers
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "subscriber", // subscribed to
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCounts: {
          $size: "$subscribers",
        },
        channelSubscribeToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project:{
        fullName:1,
        username:1,
        avatar:1,
        coverImage:1,
        username:1,
        subscriberCounts:1,
        channelSubscribeToCount:1,
        isSubscribed:1

      }
    }




  ]);

  

// check console of channel and check dataype then work further
   
if(!channel.length){
  throw new apiError(400,"channel does not exists")
}

return res.status(200).
json(new apiResponse(200,channel[0],"fetched successfully"))


});

// ============== watch history = ============ 
const getWatchHistory = asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistoy",
        foreignField:"_id",
        as:"watchHistoy",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1,
                    coverImage:1,

                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    },
 
  ])
return res.status(200)
        .json(new apiResponse(200,user[0].wathHistory,"Watch history fetched successfully"))

})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePasssword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory

};

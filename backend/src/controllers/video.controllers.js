import { json } from "express";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

// ============ All videos without login ============
const allVideos = asyncHandler(async(req,res)=>{
   const videos  = await Video.find()
   console.log("*******",videos)
    return res.status(200)
       .json(new apiResponse(200,videos,"all videos fetched without login"))
})
// ============== Get all videos ===========
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    console.log("query++++",req.query)
    //TODO: get all videos based on query, sort, pagination

    if(!userId){
      throw new apiError(400,"user not found")
    }

    const usersVideos  = await Video.find({owner:userId})
       if(!usersVideos){
      throw new apiError(400,"no videos for current user")
    }
    console.log("videos ************ ",usersVideos)

    return res.status(200)
       .json(new apiResponse(200,usersVideos,"all videos fetched"))
})
// ============ Publish a video ============
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // console.log("req.body", req.user);

  if (!title || !description) {
    throw new apiError(400, "Title or description is required");
  }

  const videoLoacalPath = req.files?.videoFile?.[0]?.path;
  console.log("*****", req.files);

  if (!videoLoacalPath) {
    throw new apiError(400, "video is required");
  }
  const thumbnailLoacalPath = req.files?.thumbnail?.[0]?.path;
  if (!thumbnailLoacalPath) {
    throw new apiError(400, "thumbnail is required");
  }

  const videoFile = await uploadOncloudinary(videoLoacalPath);
  // console.log("cloudinary file", videoFile);
  if (!videoFile) {
    throw new apiError(500, "cloudinary error while uploading video");
  }
  const thumbnail = await uploadOncloudinary(thumbnailLoacalPath);
  if (!thumbnail) {
    throw new apiError(500, "cloudinary error while uploading thumbnail");
  }

  const data = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new apiResponse(200, data, "video uploaded successfully"));
});

// =========== Get video by id =========

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "video is required");
  }
  const video = await Video.findById(videoId);
  console.log("videobyid====>", video);
  if (!video) {
    throw new apiError(404, "video not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, video, "video fetched succesfully"));
});

// ============ Update video details ============
const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new apiError(400, "video is required");
  }

  // console.log("req.body", req.body);

  if (!title?.trim() || !description.trim()) {
    throw new apiError(400, "Title or description is required");
  }
  // console.log("req.files", req.file);\

  const localPath = req.file?.path;
  if (!localPath) {
    throw new apiError(400, "thumbnail is required");
  }

  const url = await uploadOncloudinary(localPath);
  if (!url) {
    throw new apiError(500, "cloudinary error while uploading thumbnail");
  }

  const object = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        thumbnail: url?.url,
      },
    },
    {
      new: true,
    }
  );
  if (!object) {
    throw new apiError(404, "video not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, object, "video details updated"));
});

// ============== Delete a vide ================

const deleteVideo = asyncHandler(async(req,res)=>{
  const {videoId} = req.params;
  if(!videoId){
    throw new apiError(400,"video is required to delete")
  }

  const deleteVideo = await Video.findOneAndDelete(videoId) 
  // const deleteVideo = await Video.deleteOne({id:videoId}) 
  // console.log("delete video",deleteVideo)
  if(!deleteVideo){
    throw new apiError(400,"video not deleted")
  }

  return res.status(200)
    .json(new apiResponse(200,{},"video deleted successfully")
  )

})


// =============== toggle publish status ==============
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { id } = req.params // take boolean from frontend
    if(!id){
      throw new apiError(400,"video is required to publish/Unpublish")
    }
    const video = await Video.findById(id)
    if(!video){
      throw new apiError(404,"video not found")
    }
     video.isPublished = !video.isPublished
     
     video.save(); // to save response in db

     return res.status(200)
     .json(new apiResponse(200,video,`video ${video.isPublished?"Published":"unpublished"} `))

  })


export {allVideos, publishVideo, getVideoById, updateVideoDetails,deleteVideo,togglePublishStatus,getAllVideos}

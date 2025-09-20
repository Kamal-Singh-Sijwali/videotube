import mongoose, { isValidObjectId } from "mongoose";
import { apiError } from "../utils/apiError.js";
import { PlayList } from "../models/playlist.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name) {
    throw new apiError(400, "Name is Empty");
  }
  const playlist = await PlayList.create({
    name,
    description,
    owner: req.user?._id,
  });
  if (!playlist) {
    throw new apiError(401, "Error while creating Playlist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!userId) {
    throw new apiError(400, "No user exists");
  }
  const userlists = await PlayList.find({ owner: userId });

  if (!userlists) {
    throw new apiError(400, "Error while finding playlist");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, userlists, "Successfully fetched user's playlist")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
   if (!playlistId) {
    throw new apiError(400, "No playlist exists");
  }
  const lists = await PlayList.findById(playlistId);
console.log("lists",lists)
  if (!lists) {
    throw new apiError(400, "Error while finding lists");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, lists, "Successfully fetched  playlist")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if(!videoId){
    throw new apiError(400,"Please select a video to add in playlist")
  }

  const video =await Video.findById(videoId)
  console.log("update video",video)
   if(!video){
    throw new apiError(400,"video not found")
  }
  const update = await PlayList.findByIdAndUpdate(
     playlistId,
    {
   $push:{
    videos:video?._id
   }
  },{new:true}
).populate("videos")


 if(!update){
    throw new apiError(400,"Error while adding video in playlist")
  }

return res.status(200)
 .json(new apiResponse(200,update,"Video added to playlist"))

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

   if(!videoId){
    throw new apiError(400,"Please select a video to delete from playlist")
  }

//   const video =await Video.findById(videoId)
//   console.log("update video",video)
//    if(!video){
//     throw new apiError(400,"video not found")
//   }
  const update = await PlayList.findByIdAndUpdate(
     playlistId,
    {
    $pull:{
        videos:videoId
    }
        
  },{new:true}
)


 if(!update){
    throw new apiError(400,"Error while deleting video from playlist")
  }

return res.status(200)
 .json(new apiResponse(200,update,"Video deleted from playlist"))
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if(!playlistId){
    throw new apiError(400,"Please select a playlist to delete")
  }

  await PlayList.findByIdAndDelete(playlistId)

  return res.status(200)
    .json(new apiResponse(200,{},"Playlist deleted successfully"))
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if(!playlistId){
    throw new apiError(400,"Select a video");
  }
  if(!name){
    throw new apiError(400,"Name is required");
  }
  const updateData = await PlayList.findByIdAndUpdate(
                            playlistId,
                            {
                                $set:{
                                    name,
                                    description
                                }
                            },{new:true}
  )
   if(!updateData){
    throw new apiError(400,"Error while updating playlist");
  }
  return res.status(200)
        .json(new apiResponse(200,updateData,"Playlist updated"))
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

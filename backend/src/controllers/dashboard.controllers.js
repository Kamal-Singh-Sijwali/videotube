import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Video } from "../models/video.model.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
// import {Video} from "../models/video.model.js"
// import {Subscription} from "../models/subscription.model.js"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    if(!mongoose.isValidObjectId(channelId)){
        throw new apiError(400,"Channel is invalid")
    }
    const channelAllVideos = await Video.find({owner:channelId})
    const channelAllLikes = await Like.find({video:channelAllVideos.map((id)=>id?._id)})
    console.log("***********likes**",channelAllLikes)
    const channelSubscribers = await Subscription.find({subscriber:channelId})
     if(!channelAllVideos){
        throw new apiError(400,"Error no videos found")
    }
    //  if(!channelAllLikes){
    //     throw new apiError(400,"Error while finding likes")
    // }
     if(!channelSubscribers){
        throw new apiError(400,"Error while finding suscribers")
    }
    // console.log("***********",channelAllVideos.map((view)=>view?.views).reduce((acc,cur)=>acc+cur))
    const stats = {
        views:channelAllVideos.map((view)=>view?.views).reduce((acc,cur)=>acc+cur),
        subscribers:channelSubscribers.length,
        totalVideos:channelAllVideos.length,
        likes:channelAllLikes.length
    }
     return res.status(200)
        .json(new apiResponse(200,stats,"Channel all Stats"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    if(!mongoose.isValidObjectId(channelId)){
        throw new apiError(400,"Channel id is invalid")
    }
    const allVideos = await Video.find({owner:channelId})
    if(!allVideos){
        throw new apiError(400,"Error while getting videos from Database")
    }
    console.log("*******",allVideos)
    return res.status(200)
        .json(new apiResponse(200,allVideos,"Channel all videos"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
import mongoose, {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Like } from "../models/like.model.js"
import { apiResponse } from "../utils/apiResponse.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId||!mongoose.isValidObjectId(videoId)){
        throw new apiError(400,"video is required to like") 
    }
    
    const like =await Like.findOne({
        video:videoId,
        likedBy:req.user?._id
    })

    if(like){
        await Like.findByIdAndDelete(like?._id)
        like.isLike = false
        return res.status(200).json(new apiResponse(200,{islike:false},"video unliked"))
    }
    else {
        const newLike = await Like.create({
            video:videoId,
            likedBy:req.user?._id,
           
        })
        return res.status(200).json(new apiResponse(200,{newLike,isLike:true},"video liked"))

    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
     if(!commentId){
        throw new apiError(400,"comment is required to like") 
    }
    
    const like =await Like.findOne({
        comment:commentId,
        likedBy:req.user?._id
    })

    if(like){
        await Like.findByIdAndDelete(like?._id)
        like.isLike = false
        return res.status(200).json(new apiResponse(200,{islike:false},"comment unliked"))
    }
    else {
        const newLike = await Like.create({
            comment:commentId,
            likedBy:req.user?._id,
        })
        newLike.isLike = true
        return res.status(200).json(new apiResponse(200,{newLike,islike:true},"comment liked"))

    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
     if(!tweetId){
        throw new apiError(400,"tweetId is required to like") 
    }
    
    const like =await Like.findOne({
        tweet:tweetId,
        likedBy:req.user?._id
    })

    if(like){
        await Like.findByIdAndDelete(like?._id)
        like.isLike = false
        return res.status(200).json(new apiResponse(200,{},"tweet unliked"))
    }
    else {
        const newLike = await Like.create({
            tweet:tweetId,
            likedBy:req.user?._id,
        })
        newLike.isLike = true
        return res.status(200).json(new apiResponse(200,newLike,"tweet liked"))

    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {videoId} = req.params
     if(!videoId){
        throw new apiError(400,"video is required to all like") 
    }
    const allLikes = await Like.find({video:videoId})
    console.log("all likes",allLikes)
     if(!allLikes){
        throw new apiError(400,"Error while fertching all likes") 
    }
    return res.status(200).json(new apiResponse(200,allLikes,"All like on video fetched"))


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
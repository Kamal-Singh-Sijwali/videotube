
import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Comment } from "../models/comment.model.js"
import { apiResponse } from "../utils/apiResponse.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
           throw new apiError(400,"video is requied")
    }

    const comments = await Comment.find({video:videoId})
    
      if(!comments){
        throw new apiError(401,"Error while getting all comment")
    }

    return res.status(200)

    .json(new apiResponse(200,comments,"All Comments"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if(!content.trim()){
        throw new apiError(400,"comment is requied")
    }
    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:req.user?._id
    })

    if(!comment){
        throw new apiError(401,"Error while adding comment")
    }

    return res.status(200)

    .json(new apiResponse(200,comment,"Comment added"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {videoId,commentId} = req.params
    const {content} = req.body
    if(!content.trim()){
        throw new apiError(400,"comment is requied")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
        content:content,
        video:videoId,
        owner:req.user?._id
    },
    {new:true}
)
   

    if(!comment){
        throw new apiError(401,"Error while updating comment")
    }

    return res.status(200)

    .json(new apiResponse(200,comment,"Comment updated"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
      if(!commentId.trim()){
        throw new apiError(400,"comment is requied")
    }
    const comment = await Comment.findByIdAndDelete(commentId)

     if(!comment){
        throw new apiError(401,"Error while deleting comment")
    }

    return res.status(200)

    .json(new apiResponse(200,{},"Comment deleted"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }

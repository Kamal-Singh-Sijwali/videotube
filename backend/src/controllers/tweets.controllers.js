import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Tweet } from "../models/tweet.model.js"
import { apiResponse } from "../utils/apiResponse.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new apiError(400,"content is required")
    }
    const tweet = await Tweet.create({
        content:content,
        owner:req.user?._id
    })

      if(!tweet){
        throw new apiError(400,"Error while adding tweet")
    }

    return res.status(200)
            .json(new apiResponse(200,tweet,"tweet added"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const allTweets = await Tweet.find({owner:req.user?._id})

    
      if(!allTweets){
        throw new apiError(400,"Error while fetching all tweets")
    }

    return res.status(200)
            .json(new apiResponse(200,allTweets,"All tweet fetched"))
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if(!tweetId||!mongoose.isValidObjectId(tweetId)){
        throw new apiError(400,"invalid tweet id")
    }
      if(!content){
        throw new apiError(400,"content is required")
    }
    

    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content:content
        },
        {new:true}
    )
     if(!updateTweet){
        throw new apiError(400,"Error while updatng tweet")
    }

    return res.status(200)
            .json(new apiResponse(200,updateTweet,"All tweet fetched"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
      const {tweetId} = req.params
  
    if(!tweetId||!mongoose.isValidObjectId(tweetId)){
        throw new apiError(400,"invalid tweet id")
    }
   
    const deleteTweet = await Tweet.findByIdAndDelete(tweetId)
    
     if(!deleteTweet){
        throw new apiError(400,"Error while deleting tweet")
    }

    return res.status(200)
        .json(new apiResponse(200,{},"delete tweet successfully"))
  
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
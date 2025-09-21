import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { allVideos, deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoDetails } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/allVideos").get(allVideos)
router.route("/uploadVideo").post(verifyJWT,upload.fields([{name:"videoFile",maxCount:1},{name:"thumbnail",maxCount:1}]),publishVideo)
router.route("/:videoId").get(getVideoById)
router.route("/:videoId").post(verifyJWT,upload.single("thumbnail"),updateVideoDetails)
router.route("/:videoId").delete(verifyJWT,deleteVideo)
router.route("/:id").put(verifyJWT,togglePublishStatus)
router.route("/").get(verifyJWT,getAllVideos)

export default router
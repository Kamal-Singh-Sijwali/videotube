import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comments.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/:videoId",verifyJWT,getVideoComments)
router.post("/:videoId",verifyJWT,addComment)
router.put("/:videoId/:commentId",verifyJWT,updateComment)
router.delete("/:commentId",verifyJWT,deleteComment)

export default router
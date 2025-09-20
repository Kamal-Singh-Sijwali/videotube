import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create",verifyJWT,createPlaylist)
router.get("/:userId",verifyJWT,getUserPlaylists)
router.get("/lists/:playlistId",verifyJWT,getPlaylistById)
router.put("/:playlistId/:videoId",verifyJWT,addVideoToPlaylist)
router.delete("/:playlistId/:videoId",verifyJWT,removeVideoFromPlaylist)
router.patch("/update/:playlistId",verifyJWT,updatePlaylist)

export default router
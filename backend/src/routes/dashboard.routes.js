import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getChannelStats, getChannelVideos } from '../controllers/dashboard.controllers.js';



const routes = new Router();

routes.get("/stats/:channelId",verifyJWT,getChannelStats)
routes.get("/getAllvideos/:channelId",verifyJWT,getChannelVideos)

export default routes;

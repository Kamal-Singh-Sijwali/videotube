import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getChannelStats, getChannelVideos } from '../controllers/dashboard.controllers.js';

const routes = Router();

routes.get("/stats", verifyJWT, getChannelStats);
routes.get("/videos", verifyJWT, getChannelVideos);
routes.get("/stats/:channelId", verifyJWT, getChannelStats);
routes.get("/getAllvideos/:channelId", verifyJWT, getChannelVideos);

export default routes;

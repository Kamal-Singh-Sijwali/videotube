import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUserNotifications).delete(clearAllNotifications);
router.route("/read-all").patch(markAllNotificationsAsRead);
router.route("/:id/read").patch(markNotificationAsRead);
router.route("/:id").delete(deleteNotification);

export default router;

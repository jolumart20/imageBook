import { Router } from "express";
const router = Router();
import { authMiddleware } from "../controllers/index.js";
import { authCtrl } from "../controllers/index.js";
// Controllers
import {
  homeCtrl as home,
  imageCtrl as image,
} from "../controllers/index.js";

// router.get("/", home.index);
router.get("/", authCtrl.renderSignIn);
router.post("/", authCtrl.signIn);
router.get("/index",authMiddleware.authenticateToken, home.index);
router.get("/images/:image_id", image.index);
router.post("/images", image.create);
router.post("/images/:image_id/like", image.like);
router.post("/images/:image_id/comment", image.comment);
router.delete("/images/:image_id", image.remove);
router.get("/images/:image_id/comments", image.getComments);
router.get("/sidebar", home.sidebarContent);
router.get("/image/:image_id", image.getImage);

export default router;

import express from "express"
import { protectedroute } from "../middleware/auth.middleware.js";
import { getuserforsidebar } from "../controllers/message.controllers.js";
import { getmessages } from "../controllers/message.controllers.js";
import { sendmessage } from "../controllers/message.controllers.js";
const router = express.Router();


router.get("/users",protectedroute,getuserforsidebar);
router.get("/:id",protectedroute,getmessages);
router.post("/send/:id",protectedroute,sendmessage)
export default router
import express from "express"
const router =express.Router();
import { signup,login,logout, checkauth,updateprofile } from "../controllers/auth.controller.js";
import { protectedroute } from "../middleware/auth.middleware.js";
router.post("/signup", signup)

router.post("/login", login)

router.post("/logout",logout)

router.put("/update-profile",protectedroute,updateprofile)

router.get("/check",protectedroute,checkauth)
export default router;

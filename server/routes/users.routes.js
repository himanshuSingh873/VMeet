import { Router } from "express";
import {userLogin,userRegister,getUserHistory,addToHistory} from "../controllers/user.controlers.js";
const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/get_all_activity",getUserHistory )
router.post("/add_all_activity",addToHistory)

export default router;
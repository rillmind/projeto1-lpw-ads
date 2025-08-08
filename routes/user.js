import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/user.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);

export default router;

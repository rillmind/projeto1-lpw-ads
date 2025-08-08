import { Router } from "express";
import { getAllPlans } from "../controllers/plan.js";

const router = Router();

router.get("/plans", getAllPlans);

export default router;

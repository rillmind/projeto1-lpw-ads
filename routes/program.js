import { Router } from "express";
import { getAllPrograms } from "../controllers/program.js";

const router = Router();

router.get("/programs", getAllPrograms);

export default router;

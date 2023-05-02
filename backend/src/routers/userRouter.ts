import userController from "../controllers/userController";
import { Router } from "express";
const router: Router = Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

export default router;

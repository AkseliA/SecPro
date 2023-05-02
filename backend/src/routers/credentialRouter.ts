import { Router } from "express";
import credentialController from "../controllers/credentialController";
import authController from "../controllers/authController";
const router: Router = Router();

router.post(
  "/",
  authController.authenticateJwt,
  credentialController.addCredential
);
router.put(
  "/",
  authController.authenticateJwt,
  credentialController.updateCredential
);
router.get(
  "/",
  authController.authenticateJwt,
  credentialController.getCredentials
);

export default router;

import { Router } from "express";
import apiController from "../controller/apiController.js";

export const router: Router = Router();

router.route("/self").get(apiController.self);
router.route("/health").get(apiController.health);

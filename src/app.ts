import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { router } from "./router/apiRouter.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import applicationResponseMessage from "./constants/applicationResponseMessage.js";
import httpError from "./util/httpError.js";
import helmet from "helmet";
import cors from "cors";
import config from "./config/config.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

export const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------
app.disable("x-powered-by");
app.use(rateLimiter);
app.use(helmet());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    origin: config.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(cookieParser());

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

app.use("/api/v1", router);
app.use("/api/auth/", authRouter);
//
// 404 HANDLER
//

app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(applicationResponseMessage.NOT_FOUND("route"));
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

//
//GLOBAL ERROR HANDLER
//

app.use(globalErrorHandler);

import dotenvFlow from "dotenv-flow";
import { z } from "zod";
import { EApplicationEnvironment } from "../constants/application.js";

dotenvFlow.config();

const envSchema = z.object({
  NODE_ENV: z.nativeEnum(EApplicationEnvironment),

  PORT: z.coerce.number().int().positive(),

  SERVER_URI: z.string().url(),
  MONGO_URI: z.string(),
  CLIENT_ORIGIN: z.string(),
  JWT_SECRET: z.string(),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  REFRESH_TOKEN: z.string(),
  EMAIL_USER: z.string(),
});

export const env = envSchema.parse(process.env);

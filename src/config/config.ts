import { env } from "../validation/env.js";

export default {
  ENV: env.NODE_ENV,
  PORT: env.PORT,
  SERVER_URI: env.SERVER_URI,
  MONGO_URI: env.MONGO_URI,
  CLIENT_ORIGIN: env.CLIENT_ORIGIN,
  JWT_SECRET: env.JWT_SECRET,
  CLIENT_ID: env.CLIENT_ID,
  CLIENT_SECRET: env.CLIENT_SECRET,
  REFRESH_TOKEN: env.REFRESH_TOKEN,
  EMAIL_USER: env.EMAIL_USER,
};

import config from "./config/config.js";
import { app } from "./app.js";
import logger from "./util/logger.js";
import { gracefulShutdown } from "./util/gracefullShutDown.js";
import databaseService from "./services/databaseService.js";

const PORT = config.PORT ?? 3000;

export const server = app.listen(PORT, () => {
  //logger.log(`SERVER IS UP AND RUNNING ON PORT ${PORT}`)
});
(async () => {
  //DB CONNECTION
  const connection = await databaseService.connect();
  logger.info(`DATABASE CONNECTION`, {
    meta: {
      CONNECTION_NAME: connection.name,
    },
  });
  try {
    logger.info(`APPLICATION STARTED`, {
      meta: {
        PORT: PORT,
        SERVER_URI: config.SERVER_URI,
      },
    });
  } catch (error) {
    logger.error(`ERROR WHILE STARTING THE APPLICATION`, {
      meta: {
        error: error,
      },
    });
    server.close((error) => {
      if (error) {
        logger.error(`ERROR WHILE CLOSING THE SERVER`, {
          meta: {
            error,
          },
        });

        process.exit(1);
      }
    });
  }
})();

process.on("SIGINT", () => {
  void gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void gracefulShutdown("SIGTERM");
});

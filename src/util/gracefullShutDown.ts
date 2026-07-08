import { server } from '../server.js'
import logger from './logger.js'

export const gracefulShutdown = (signal: string): void => {
  logger.info(`${signal} received`)

  server.close(() => {
    void shutdown()
  })
}

function shutdown() {
  try {
    // await db.close()
    // await redis.quit()

    logger.info('Shutdown complete')
    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

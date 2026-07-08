import type { Request } from 'express'
import type { THttpError } from '../types/types.js'
import config from '../config/config.js'
import { EApplicationEnvironment } from '../constants/application.js'
import applicationResponseMessage from '../constants/applicationResponseMessage.js'
import logger from './logger.js'

export function errorObject<T = null>(
  req: Request,
  err: unknown,
  errorStatusCode = 500,
  data: T | null = null,
): THttpError<T> {
  const request = {
    method: req.method,
    url: req.originalUrl,
    ...(config.ENV !== EApplicationEnvironment.PRODUCTION && {
      ip: req.ip ?? null,
    }),
  }

  const trace =
    config.ENV !== EApplicationEnvironment.PRODUCTION && err instanceof Error
      ? { error: err.stack }
      : null

  const errorObj: THttpError<T> = {
    success: false,
    statusCode: errorStatusCode,
    request,
    message:
      err instanceof Error
        ? err.message || applicationResponseMessage.SOMETHING_WENT_WRONG
        : applicationResponseMessage.SOMETHING_WENT_WRONG,
    data,
    trace,
  }

  logger.error('ERROR_CONTROLLER', {
    meta: errorObj,
  })

  return errorObj
}

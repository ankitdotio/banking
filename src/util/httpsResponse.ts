import type { Request, Response } from 'express'
import type { THttpResponse } from '../types/types.js'
import config from '../config/config.js'
import { EApplicationEnvironment } from '../constants/application.js'
import logger from './logger.js'

export function httpResponse<T>(
  req: Request,
  res: Response,
  responseStatusCode: number,
  responseMessage: string,
  data: T | null = null,
): void {
  const request = {
    method: req.method,
    url: req.originalUrl,
    ...(config.ENV !== EApplicationEnvironment.PRODUCTION && {
      ip: req.ip ?? null,
    }),
  }

  const response: THttpResponse<T> = {
    success: true,
    statusCode: responseStatusCode,
    request,
    message: responseMessage,
    data,
  }

  logger.info('CONTROLLER RESPONSE', {
    meta: response,
  })

  res.status(responseStatusCode).json(response)
}

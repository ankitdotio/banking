import type { NextFunction, Request } from 'express'

import { errorObject } from './errorObject.js'

export default (
  nextfunc: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  err: Error | unknown,
  req: Request,
  errorStatusCode: number = 500,
) => {
  const errObj = errorObject(req, err, errorStatusCode)
  return nextfunc(errObj)
}

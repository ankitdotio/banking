export type THttpResponse<T = unknown> = {
  success: true
  statusCode: number
  request: {
    ip?: string | null
    url: string
    method: string
  }
  message: string
  data: T | null
  trace?: object | null
}

export type THttpError<T = unknown> = {
  success: false
  statusCode: number
  request: {
    ip?: string | null
    url: string
    method: string
  }
  message: string
  data: T | null
  trace?: object | null
}

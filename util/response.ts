import { Context } from 'koa'

//成功请求
export const reqSuccess = (
  ctx: Context,
  data: any = [],
  msg: string = 'success',
  status: number = 200
) => {
  ctx.status = status
  ctx.body = {
    status,
    msg,
    data,
  }
}

//失败的请求
export const reqError = (
  ctx: Context,
  msg: any = 'error',
  status: number = 400,
  data: any = []
) => {
  ctx.status = status
  ctx.body = {
    status,
    msg,
    data,
  }
}

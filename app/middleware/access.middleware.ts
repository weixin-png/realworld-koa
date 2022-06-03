import { Context, Next } from 'koa'
import { accessLogger } from '../logger'


export const accessLog = (ctx: Context, next: Next) => {
  const reqInfo = `path:${ctx.path}, method:${ctx.method}, user-agent:${ctx.headers['user-agent']}`
  accessLogger.info(reqInfo)
  return next()
}

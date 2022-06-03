import { Context, Next } from 'koa'
import { verify } from '../../util/auth'
import User from '../model/user'

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  
  //请求头中有token
  if (token !== undefined && token !== '') {
    //有authorization字段
    const { error, user } = verify(token)
    //token错误或者过期
    if (error) {
      return (ctx.body = {
        msg: error.message,
        status: 401,
      })
    } else {
      //放行
      ctx.user = await User.findByPk((user as { userId: string }).userId)
      return next()
    }
  }
  return (ctx.body = {
    msg: 'authorization 字段不能为空',
    status: 401,
  })
}

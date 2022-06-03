import { Server } from 'http'
import Koa from 'koa'
import KoaBody from 'koa-body'
import { koaSwagger } from 'koa2-swagger-ui'
import router from './router'
import swagger from '../util/swagger'
import cors from 'koa2-cors'

import dotenv from 'dotenv'
import { accessLog } from './middleware/access.middleware'
dotenv.config()

const app = new Koa()
//安装路由
app
  .use(
    cors({
      //设置允许来自指定域名请求
      origin: ctx => {
        return '*' // 允许来自所有域名请求
      },
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], //设置获取其他自定义字段
    })
  )
  .use(swagger.routes())
  .use(swagger.allowedMethods())
  .use(
    koaSwagger({
      routePrefix: '/swagger', // host at /swagger instead of default /docs
      swaggerOptions: {
        url: '/swagger.json', // example path to json 其实就是之后swagger-jsdoc生成的文档地址
      },
    })
  )
  .use(
    KoaBody({
      multipart: true,
      formidable: {
        maxFileSize: 200 * 1024 * 1024, //2Mb
      },
    })
  )
  .use(accessLog)  //访问日志中间件
  .use(router.routes())

const run = (port: any): Server => {
  return app.listen(port)
}

export default run

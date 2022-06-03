import { Context } from 'koa'

// const router = require('koa-router')() //引入路由函数
import KoaRouter from 'koa-router'
const router = new KoaRouter()
// const swaggerJSDoc = require('swagger-jsdoc')
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  info: {
    title: 'RealWorld',
    version: '1.0.0',
    description: '接口服务',
  },
  host: 'localhost:8080',
  basePath: '/api/v1', // Base path (optional)
}

const options = {
  swaggerDefinition,
  apis: ['./app/router/*.ts'], // 写有注解的router的存放地址
}

const swaggerSpec = swaggerJSDoc(options)

// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx: Context) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = swaggerSpec
})

export default router
//将页面暴露出去

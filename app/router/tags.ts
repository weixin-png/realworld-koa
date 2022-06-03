import koaRouter from 'koa-router'
import tagsController from '../controller/tags.controller'


const tagsRouter = new koaRouter({ prefix: '/tags' })

//获取标签列表
/**
 * @swagger
 * /tags:
 *   get:
 *     tags:
 *       - 标签相关
 *     description: 获取标签列表
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取标签列表
 *         schema:
 *           $ref: '#/definitions/user'
 */
tagsRouter.get('/', tagsController.getTagList)

export default tagsRouter
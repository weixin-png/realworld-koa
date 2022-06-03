import KoaRouter from 'koa-router'
import articleController from '../controller/article.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const articleRouter = new KoaRouter({ prefix: '/articles' })

/**
 * @swagger
 * definitions:
 *   article:
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       body:
 *         type: string
 *       userId:
 *         type: string
 *       tags: 
 *         type: array
 */

/* slug为articleId */
//获取文章列表
/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - 文章相关
 *     description: 根据条件获取文章列表
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取文章列表
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.get('/', articleController.getArticles)
//获取文章
/**
 * @swagger
 * /articles/:slug:
 *   get:
 *     tags:
 *       - 文章相关
 *     description: 查找文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 查找文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.get('/:slug', articleController.getArticle)
//创建文章
/**
 * @swagger
 * /articles:
 *   post:
 *     tags:
 *       - 文章相关
 *     description: 创建文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 创建文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.post('/', authMiddleware, articleController.createArticle)

//更新文章
/**
 * @swagger
 * /articles/:slug:
 *   put:
 *     tags:
 *       - 文章相关
 *     description: 更新文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 更新文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.put('/:slug', authMiddleware, articleController.updateArticle)
//删除文章
/**
 * @swagger
 * /articles/:slug:
 *   delete:
 *     tags:
 *       - 文章相关
 *     description: 删除文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 删除文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.delete('/:slug', authMiddleware, articleController.deleteArticle)
//feed文章（不开发）
/**
 * @swagger
 * /articles/feed:
 *   get:
 *     tags:
 *       - 文章相关
 *     description: feed文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: feed文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.get('/feed', authMiddleware, articleController.feedArticle)
//给文章添加评论
/**
 * @swagger
 * /articles/:slug/comments:
 *   post:
 *     tags:
 *       - 文章相关
 *     description: 给文章添加评论
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 给文章添加评论
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.post(
  '/:slug/comments',
  authMiddleware,
  articleController.reviewArticle
)
//获取文章的评论
/**
 * @swagger
 * /articles/:slug/comments:
 *   get:
 *     tags:
 *       - 文章相关
 *     description: 获取文章的评论
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取文章的评论
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.get('/:slug/comments', articleController.getArticleComments)
//删除文章某条评论
/**
 * @swagger
 * /articles/:slug/:commentId:
 *   get:
 *     tags:
 *       - 文章相关
 *     description: 删除文章某条评论
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 删除文章某条评论
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.delete(
  '/:slug/comments/:commentId',
  authMiddleware,
  articleController.deleteArticleComments
)
//点赞文章
/**
 * @swagger
 * /articles/:slug/favorite:
 *   post:
 *     tags:
 *       - 文章相关
 *     description: 点赞文章
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 点赞文章
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.post(
  '/:slug/favorite',
  authMiddleware,
  articleController.likeArticle
)
//对文章取消点赞
/**
 * @swagger
 * /articles/:slug/favorite:
 *   delete:
 *     tags:
 *       - 文章相关
 *     description: 对文章取消点赞
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 对文章取消点赞
 *         schema:
 *           $ref: '#/definitions/article'
 */
articleRouter.delete(
  '/:slug/favorite',
  authMiddleware,
  articleController.unlikeArticle
)

export default articleRouter

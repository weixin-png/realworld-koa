import KoaRouter from 'koa-router'
import profileController from '../controller/profile.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const profileRouter = new KoaRouter({ prefix: '/profiles' })

/**
 * @swagger
 * definitions:
 *   profile:
 *     properties:
 *       username:
 *         type: string
 *       bio:
 *         type: string
 *       image:
 *         type: string
 *       following:
 *         type: boolean
 */

//获取用户个人信息
/**
 * @swagger
 * /profiles/:userId:
 *   get:
 *     tags:
 *       - 个人信息相关
 *     description: 获取用户个人信息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取用户个人信息
 *         schema:
 *           $ref: '#/definitions/user'
 */
profileRouter.get('/:userId',authMiddleware, profileController.getProfiles)

//关注用户
/**
 * @swagger
 * /profiles/:userId/follow:
 *   post:
 *     tags:
 *       - 个人信息相关
 *     description: 关注用户
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 关注用户
 *         schema:
 *           $ref: '#/definitions/user'
 */
profileRouter.post(
  '/:username/follow',
  authMiddleware,
  profileController.followUser
)

//取消关注用户
/**
 * @swagger
 * /profiles/:userId/follow:
 *   delete:
 *     tags:
 *       - 个人信息相关
 *     description: 取消关注用户
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 取消关注用户
 *         schema:
 *           $ref: '#/definitions/user'
 */
profileRouter.delete(
  '/:username/follow',
  authMiddleware,
  profileController.cancleFollowUser
)

export default profileRouter

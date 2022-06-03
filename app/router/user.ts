import KoaRouter from 'koa-router'

//controller
import userController from '../controller/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const userRouter = new KoaRouter()

/**
 * @swagger
 * definitions:
 *   user:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 *       bio:
 *         type: string
 *       image:
 *         type: string
 *       followed:
 *         type: boolean
 */

//用户注册
/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - 用户相关
 *     description: 用户注册
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 用户注册
 *         schema:
 *           $ref: '#/definitions/user'
 */

userRouter.post('/users', userController.userRegister)

//用户登录
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - 用户相关
 *     description: 用户登录
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 用户登录
 *         schema:
 *           $ref: '#/definitions/user'
 */

userRouter.post('/users/login', userController.userLogin)

//获取当前用户
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - 用户相关
 *     description: 获取当前用户
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取当前用户
 *         schema:
 *           $ref: '#/definitions/user'
 */

userRouter.get('/user', authMiddleware, userController.getCurrentUser)

//更新用户
/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - 用户相关
 *     description: 更新用户
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 更新用户
 *         schema:
 *           $ref: '#/definitions/user'
 */

userRouter.put('/user', authMiddleware, userController.updateUser)

export default userRouter

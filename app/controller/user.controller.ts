import { Rules } from 'async-validator'
import { Context } from 'koa'

import { sign } from '../../util/auth'
import { md5 } from '../../util/md5'
import { objFilter } from '../../util/objFilter'
import { reqError, reqSuccess } from '../../util/response'
import validate from '../../util/validate'
import User from '../model/user'
import userService from '../service/user.service'

class UserController {
  //用户登录
  async userLogin(ctx: Context) {
    //定义校验规则
    const rules: Rules = {
      user: {
        type: 'object',
        required: true,
        fields: {
          email: [
            {
              type: 'string',
              required: true,
            },
          ],
          password: [
            {
              type: 'string',
              required: true,
              min: 8,
              max: 20,
            },
          ],
        },
      },
    }

    try {
      const { data, error } = await validate<{ user: User }>(ctx, rules)
      if (error) {
        //数据有误
        return reqError(ctx, error)
      }
      let user = await userService.findUserByEmial(data.user.email as string)

      if (!user) {
        return reqError(ctx, '邮箱不存在', 404)
      }
      //找到了该用户，验证密码是否正确
      if (md5(data.user.password as string) !== user.password) {
        return reqError(ctx, '密码错误', 400)
      }
      //根据用户信息生成token，让客户端保存
      const token = sign(user.id)

      user = user.toJSON()

      const obj = objFilter(user, ['email', 'username', 'bio', 'image'])
      //登陆成功，返回用户个人信息
      return reqSuccess(ctx, {
        user: { token, ...obj },
      })
    } catch (error: any) {
      reqError(ctx, error.message)
    }
  }

  //用户注册
  async userRegister(ctx: Context) {
    //定义校验规则
    const rules: Rules = {
      user: {
        type: 'object',
        required: true,
        fields: {
          username: [
            {
              type: 'string',
              max: 6,
              min: 2,
              required: true,
            },
          ],
          password: [
            {
              type: 'string',
              required: true,
              min: 8, //最小长度
              max: 20, //最大长度
            },
          ],
          email: [
            {
              type: 'email',
              required: true,
            },
            /*             {
              validator: function (rule, value, callback, source, options) {
                const errors: any[] = []
                console.log(value)

                // test if email address already exists in a database
                // and add a validation error to the errors array if it does
                return errors
              },
            }, */
          ],
        },
      },
    }
    try {
      const { data, error } = await validate<{ user: User }>(ctx, rules)

      if (error) {
        //数据有误
        return reqError(ctx, error)
      }
      let user = await userService.findUserByName(data.user.username as string)

      if (user) {
        return reqError(ctx, '用户名已存在')
      }

      user = await userService.findUserByEmial(data.user.email as string)
      if (user) {
        return reqError(ctx, '邮箱已存在')
      }
      //加密后再存入数据库
      data.user.password = md5(data.user.password as string)
      //sequelize-typescript also makes it possible to create instances with new:
      // user = new User(data.user)
      // user =  User.build(data.user)
      //同步到数据库
      // user.save()

      // console.log(data.user);

      user = await userService.addUser(data.user)

      //先将数据库中刚创建的这个对象转成普通对象（原对象不是标准的js对象）

      user = user.toJSON()
      //删除密码后返回给用户
      // delete user?.password
      const obj = objFilter(user, ['username', 'image', 'email', 'bio'])
      return reqSuccess(ctx, { user: { ...obj } })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //获取当前登录用户
  async getCurrentUser(ctx: Context) {
    try {
      let user = await userService.findUserById(ctx.user.id)
      //删除密码后返回
      user = user?.toJSON() as User
      delete user?.password
      //返回当前用户的信息（需要权限验证）
      return reqSuccess(ctx, { user })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //更新用户
  async updateUser(ctx: Context) {
    try {
      let user = (await userService.findUserById(ctx.user.id)) as User
      //新的用户信息
      // console.log(ctx.request.body)
      user = await userService.updateUser(user, ctx.request.body.user)
      user = user.toJSON()
      delete user?.password
      return reqSuccess(ctx, { user })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }
}

export default new UserController()

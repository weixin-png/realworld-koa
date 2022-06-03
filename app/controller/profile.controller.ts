import { Context } from 'koa'
import { objFilter } from '../../util/objFilter'

import { reqError, reqSuccess } from '../../util/response'
import followService from '../service/follow.service'
import userService from '../service/user.service'

class ProfileController {
  //根据用户名获取用户个人信息(无需权限)
  async getProfiles(ctx: Context) {
    try {
      //通过ctx获取params参数
      const { userId } = ctx.params
      let user = await userService.findUserById(userId)
      if (!user) {
        return reqError(ctx, '用户不存在', 404)
      }
      //存在该用户
      user = user?.toJSON()
      const obj = objFilter(user, ['username', 'bio', 'image', 'following'])
      reqSuccess(ctx, { profile: obj })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //关注用户
  async followUser(ctx: Context) {
    try {
      //用户身份信息
      const { id: userId } = ctx.user
      const username = ctx.params.username
      // 查找该用户是否存在，如果不存在返回404
      const user = await userService.findUserByName(username)
      if (!user) {
        return reqError(ctx, '用户名有误或者该用户不存在', 404)
      }
      //先查看两者之间是否有关注关系
      let follow = await followService.findIsFollowing(userId, user.id)
      if (follow) {
        //存在关注(此时只可能是following未true的情况)
        return reqError(ctx, '已关注该用户，请勿重复关注！')
      }
      //添加关注
      follow = await followService.addFollow(userId, user.id)
      follow = follow.toJSON()
      reqSuccess(ctx, { follow })
    } catch (error: any) {
      reqError(ctx, error.message)
    }
  }

  //取消关注用户
  async cancleFollowUser(ctx: Context) {
    try {
      const { id: userId } = ctx.user
      const username = ctx.params.username
      const user = await userService.findUserByName(username)
      if (!user) {
        return reqError(ctx, '该用户不存在或者用户名不正确', 404)
      }
      let follow = await followService.findIsFollowing(userId, user.id)
      if (follow) {
        //实现取消关注
        await followService.deleteFollow(follow)
        follow = follow.toJSON()
        return reqSuccess(ctx, { ...follow, following: false })
      } else {
        //不曾关注过
        return reqError(ctx, '你尚未关注该用户，请先去关注吧。')
      }
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }
}

export default new ProfileController()

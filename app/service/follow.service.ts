import Follow from '../model/follow'

class FollowService {
  //查找是否关注状态
  async findIsFollowing(userId: string, followedUserId: string) {
    return await Follow.findOne({ where: { userId, followedUserId } })
  }

  //添加关注
  async addFollow(userId: string, followedUserId: string) {
    return await Follow.create({ userId, followedUserId, following: true })
  }

  //取消关注
  async deleteFollow(follow: Follow) {
    return await follow.destroy()
  }
}

export default new FollowService()

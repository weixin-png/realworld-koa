import User from '../model/user'

class UserService {
  //通过用户名查找用户
  async findUserByName(username: string) {
    return await User.findOne({ where: { username } })
  }

  //通过用户id(主键findByPK)查找用户
  async findUserById(id: string) {
    return await User.findOne({ where: { id } })
  }

  //通过邮箱查找用户
  async findUserByEmial(email: string) {
    return await User.findOne({ where: { email } })
  }

  //添加用户
  async addUser(user: any) {
    return await User.create(user)
  }

  //更新用户
  async updateUser(user: User, data: User) {
    return await user.update(data)
  }
}

export default new UserService()

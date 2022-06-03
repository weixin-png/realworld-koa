import Favorite from '../model/favorite'

class FavoriteService {
  //查找点赞
  async findFavorite(options: { userId: string; articleId: string }) {
    return await Favorite.findOne({ where: options })
  }
  //点赞
  async favorite(userId: string, articleId: string) {
    return await Favorite.create({ userId, articleId })
  }

  //取消点赞
  cancelFavorite(favorite: Favorite) {
    return favorite.destroy()
  }

  //查看点赞数量
  async findFavoriteCount(articleId: string) {
    return await Favorite.count({ where: { articleId } })
  }
}

export default new FavoriteService()

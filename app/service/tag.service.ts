import Article from '../model/article'
import Tag from '../model/tag'

class TagService {
  //添加标签
  async addTags(name: any, articleId: number) {
    return await Tag.create({ name, articleId })
  }

  //获取标签列表
  async getTags(offset: number = 0, limit: number = 10) {
    return await Tag.findAll({ offset, limit })
  }

  //根据标签名筛选出对应的标签(并且包含对应的Article)
  async getTagsByTagName(tagName: string) {
    return await Tag.findAll({
      where: { name: tagName },
      include: [Article],
    })
  }

  //查找标签
  async FindTagByName(name: string) {
    return await Tag.findOne({ where: { name } })
  }
}

export default new TagService()

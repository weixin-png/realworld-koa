import Article from '../model/article'
import User from '../model/user'

interface queryOptions {
  limit: number
  offset: number
  tag?: string
  author?: User
  favorited?: User
}
class ArticleService {
  //创建文章
  async createArticle(article: any) {
    return await Article.create(article)
  }

  //根据查询条件查找文章
  async getAllArticles(options: queryOptions) {
    return await Article.findAll(options)
  }

  //根据id查找文章
  async getArticleBySlug(slug: string) {
    return await Article.findOne({ where: { id: slug } })
  }

  //更新文章
  async updateArticle(oldArticle: Article, newArticle: Article) {
    //文章存在，更新文章对应的属性
    oldArticle.set(newArticle)
    //此处需调用save方法将新数据同步到数据库
    return await oldArticle.save()
  }

  async deleteArticle(article: Article) {
    return await article.destroy()
  }
}

export default new ArticleService()

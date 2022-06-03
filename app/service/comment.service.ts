import Comment from '../model/comment'

/* interface Icomment {
  body: string
  userId: string
  articleId: string
} */
class ComentService {
  //添加评论
  async addComment(body: string, userId: string, articleId: string) {
    return await Comment.create({
      body,
      user_id: userId,
      article_id: articleId,
    })
  }

  //获取评论(所有）
  async getComments(articleId: string) {
    return await Comment.findAll({ where: { article_id: articleId } })
  }

  // 获取单挑评论
  async getComment(commentId: string) {
    return await Comment.findOne({ where: { id: commentId } })
  }
}

export default new ComentService()

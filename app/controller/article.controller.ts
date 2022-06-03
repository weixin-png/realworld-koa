import { Rules } from 'async-validator'
import { Context } from 'koa'
import { objFilter } from '../../util/objFilter'
import { reqError, reqSuccess } from '../../util/response'
import validate from '../../util/validate'
import Article from '../model/article'
import Comment from '../model/comment'
import Favorite from '../model/favorite'
import Tag from '../model/tag'
import User from '../model/user'
import articleService from '../service/article.service'
import commentService from '../service/comment.service'
import favoriteService from '../service/favorite.service'
import tagService from '../service/tag.service'
import userService from '../service/user.service'

class ArticleController {
  //获取文章列表
  async getArticles(ctx: Context) {
    try {
      let tag = ctx.query.tag as string | null
      //查询条件
      const options = {
        limit: Number(ctx.query.limit) || 6,
        offset: Number(ctx.query.offset) || 0,
      }
      //1.判断是否有tag字段,如果有则通过标签查找文章
      //2.找出所有符合的tag，通过tag的外键(articleId)找到对应的文章，返回给客服端
      let tags: Tag[] = []
      if (tag) {
        //查看标签是否合法
        const result = await tagService.FindTagByName(tag)
        if (!result) {
          return reqError(ctx, 'tag字段格式错误!')
        }
        let articles = [] as Article[]
        tags = await tagService.getTagsByTagName(tag)
        for (let i = 0; i < options.limit; i++) {
          articles[i] = tags[i + options.offset].article.toJSON()
        }
        return reqSuccess(ctx, { articles, total: tags.length })
      }

      //tag字段不存在
      //根据条件查找文章
      let articles: Article[] = await articleService.getAllArticles(options)
      //Article这张表中元素的个数
      let total = await Article.count()
      return reqSuccess(ctx, { articles, total })
    } catch (error: any) {
      return reqError(ctx, error)
    }
  }

  //根据id获取文章
  async getArticle(ctx: Context) {
    const slug = ctx.params.slug
    try {
      const article = await articleService.getArticleBySlug(slug)
      return reqSuccess(ctx, article?.toJSON())
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //创建文章
  async createArticle(ctx: Context) {
    const user: User = ctx.user
    const rules: Rules = {
      article: {
        type: 'object',
        required: true,
        fields: {
          title: {
            type: 'string',
            required: true,
          },
          description: {
            type: 'string',
            max: 50,
          },
          body: {
            type: 'string',
            required: true,
            max: 200,
            min: 10,
          },
          tags: {
            type: 'array',
            required: true,
          },
        },
      },
    }
    try {
      const { data, error } = await validate<{ article: Article }>(
        ctx,
        rules,
        true
      )
      if (error) {
        return reqError(ctx, error)
      }
      //添加一篇文章
      let article = await articleService.createArticle(
        Object.assign(data.article, { userId: user.id })
      )
      user.$add('article', article)
      //如果请求带有tags字段
      let tags: Tag[] = []
      //添加对应的标签
      //此处不能用forEach
      /*       data.article.tags.forEach((name, i) => {
        tagService.addTags(name, article.id).then(tag => {
          tags.push(tag.toJSON().name)
        })
      }) */
      for (let i = 0; i < data.article.tags.length; i++) {
        const tag = await tagService.addTags(data.article.tags[i], article.id)
        tags.push(tag.toJSON().name)
        // await article.$add('Tag', tag)  Tags/Tag都可以
        await article.$add('tags', tag)
      }
      //#region
      //父表查子表
      /*     const art = await Article.findOne({
      where: { id: article.id },
      include: [Tag],
    })
    art?.tags.forEach(tag => {
      console.log(`Tag${tag.name}`)
    }) */

      //通过子表查父表
      /*     const newArticle = await Tag.findOne({
      include: [Article],
      where: { articleId: article.id },
    })
    console.log(newArticle?.article.toJSON()) */

      /*       const nweUser = await User.findOne({
        include: [Article],
        where: { id: user.id },
      })
      console.log(nweUser?.toJSON().articles) */
      //#endregion

      article = article.toJSON()
      return reqSuccess(ctx, {
        article: {
          ...article,
          tags,
          author: objFilter(user.toJSON(), ['image', 'bio', 'username']),
        },
      })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //更新文章
  async updateArticle(ctx: Context) {
    try {
      const slug: string = ctx.params.slug
      const article: Article = ctx.request.body.article
      //先查看文章是否存在
      const oldArticle = await articleService.getArticleBySlug(slug)
      if (!oldArticle) {
        return reqError(ctx, '该文章不存在', 404)
      }
      //旧文章存在
      const newArticle = await articleService.updateArticle(oldArticle, article)
      return reqSuccess(ctx, { article: newArticle })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //删除文章
  async deleteArticle(ctx: Context) {
    try {
      const slug = ctx.params.slug
      const article = await articleService.getArticleBySlug(slug)
      if (!article) {
        return reqError(ctx, '此文章不存在！')
      }
      await articleService.deleteArticle(article)
      reqSuccess(ctx, '删除成功')
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //feed文章(不开发)
  feedArticle(ctx: Context) {
    reqSuccess(ctx, 'feed文章')
  }
  //对文章进行点赞
  async likeArticle(ctx: Context) {
    try {
      const userId = ctx.user.id as string
      const articleId = ctx.params.slug
      const article = await articleService.getArticleBySlug(articleId)
      let author = await userService.findUserById(
        article?.userId.toString() as string
      )
      if (author) {
        author = author.toJSON()
        delete author?.password
      }
      if (!article) {
        return reqError(ctx, '此文章不存在！')
      }
      //查看是否点赞
      const favorite = await favoriteService.findFavorite({
        userId,
        articleId,
      })
      if (favorite) {
        //取消点赞
        return favorite.destroy()
      }
      await favoriteService.favorite(userId, articleId)
      const count = await article.$count('favorited')
      article.favoritesCount = count
      article.save()
      return reqSuccess(ctx, {
        ...article.toJSON(),
        author,
      })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //对文章取消点赞
  async unlikeArticle(ctx: Context) {
    try {
      const articleId = ctx.params.slug
      const user = ctx.user
      const article = await articleService.getArticleBySlug(articleId)
      if (!article) {
        return reqError(ctx, '文章不存在！')
      }
      const favorite = await favoriteService.findFavorite({
        userId: user.id,
        articleId,
      })
      if (favorite) {
        favorite.destroy()
      }
      return reqSuccess(ctx, { article: article.toJSON() })
    } catch (error: any) {
      reqError(ctx, error.message)
    }
  }

  //评论文章
  async reviewArticle(ctx: Context) {
    try {
      //评论内容
      const body = ctx.request.body.comment.body
      //文章id
      const articleId = ctx.params.slug
      //用户信息
      const user = ctx.user

      await commentService.addComment(body, user.id, articleId)
      reqSuccess(ctx, '评论成功')
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }
  //获取文章评论
  async getArticleComments(ctx: Context) {
    try {
      //文章id
      const articleId = ctx.params.slug
      //查看文章是否存在
      const article = await articleService.getArticleBySlug(articleId)
      if (!article) {
        return reqError(ctx, '文章不存在!')
      }
      const comments = await commentService.getComments(articleId)
      return reqSuccess(ctx, { comments })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }

  //删除文章评论
  async deleteArticleComments(ctx: Context) {
    const articleId = ctx.params.slug
    const commentId = ctx.params.commentId
    //查看文章是否存在
    const article = await articleService.getArticleBySlug(articleId)
    if (!article) {
      return reqError(ctx, '文章不存在!')
    }
    const comment = await commentService.getComment(commentId)
    if (!comment) {
      return reqError(ctx, '评论不存在！')
    }
    //删除评论
    comment.destroy()
    reqSuccess(ctx, '删除评论成功。')
  }
}

export default new ArticleController()

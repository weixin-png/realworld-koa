import { Context } from 'koa'
import { reqError, reqSuccess } from '../../util/response'
import Tag from '../model/tag'
import tagService from '../service/tag.service'

class TagsController {
  //获取tags列表
  async getTagList(ctx: Context) {
    try {
      const tags = await tagService.getTags()
      const total = await Tag.count()
      reqSuccess(ctx, { tags, total })
    } catch (error: any) {
      return reqError(ctx, error.message)
    }
  }
}

export default new TagsController()

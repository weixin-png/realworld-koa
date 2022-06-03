import KoaRouter from 'koa-router'

//每个router
import userRouter from './user'
import articleRouter from './article'
import tagsRouter from './tags'
import profileRouter from './profile'

const router = new KoaRouter({ prefix: '/api/v1' })

router
  .use(userRouter.routes())
  .use(articleRouter.routes())
  .use(tagsRouter.routes())
  .use(profileRouter.routes())

export default router

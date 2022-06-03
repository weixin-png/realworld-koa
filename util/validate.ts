import Schema, { Rules, Values } from 'async-validator'
import { Context } from 'koa'

async function validate<T extends Values>(
  ctx: Context,
  rules: Rules,
  flag: boolean = false //为true时返回全部错误
): Promise<{ data: T; error: any }> {
  const validator = new Schema(rules)
  let data = {} as any
  if (ctx.method === 'POST') {
    data = getFormData(ctx)
  }

  return validator
    .validate(data)
    .then(() => {
      return {
        data: data as T,
        error: null,
      }
    })
    .catch(error => {
      
      if (flag) {
        return {
          error,
          data: {} as T,
        }
      }
      return {
        error: error,
        data: {} as T,
      }
    })
}

//获取表单数据
const getFormData = (ctx: Context) => {
  // console.log(ctx.request.body)

  return ctx.request.body
}

export default validate

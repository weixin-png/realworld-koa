/* 
过滤出对象中的属性
*/
type Obj = {
  [key: string]: any
}

export function objFilter(obj: Obj | null, arr: string[]) {
  if (obj === null) {
    return null
  }
  const result = {} as Obj
  Object.keys(obj)
    .filter(key => arr.includes(key))
    .forEach(key => {
      result[key] = obj[key]
    })
  return result
}

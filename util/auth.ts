import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken'
import config from '../app/config'

//生成token
export const sign = (userId: any) => {
  const token = jwt.sign({ userId }, config.jwt.secret as string, {
    expiresIn: config.jwt.expire,
  })
  return token
}

//验证token
export const verify = (
  token: string
): {
  user: string | JwtPayload | null
  error: JsonWebTokenError | null | TokenExpiredError
} => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret as string)
    return {
      user: decoded,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error as JsonWebTokenError | TokenExpiredError | null,
    }
  }
}

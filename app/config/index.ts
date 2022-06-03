import 'dotenv/config'

const config = {
  //服务器配置
  server: {
    port: process.env.SERVER_PORT,
    env: process.env.NODE_ENV,
  },
  //数据库配置
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  // jwt验证
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  //日志相关
  log: {
    appenders: {
      cheese: { type: 'file', filename: 'logs/cheese.log' },
      access: { type: 'file', filename: 'logs/access.log' },
      db: { type: 'file', filename: 'logs/db.log' },
    },
    categories: {
      //需要有default分类
      default: { appenders: ['cheese'], level: 'error' },
      access: { appenders: ['access'], level: 'info' },
      db: { appenders: ['db'], level: 'info' },
    },
  },
}

export default config

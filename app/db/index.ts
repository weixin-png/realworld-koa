import path from 'path'
import { Sequelize } from 'sequelize-typescript'

import config from '../config'
import { dbLogger } from '../logger'

const sequelize = new Sequelize(
  config.db.database as string,
  config.db.username as string,
  config.db.password as string,
  {
    host: config.db.host,
    port: Number(config.db.port),
    dialect: 'mysql',
    models: [
      //开发
      path.join(__dirname, '..', 'model/*.ts'),
      //生产
      // path.join(__dirname, '..', 'model/*.ts'),
    ],
    // logging: (...msg) => console.log(msg), // 显示所有日志函数调用参数
    logging: (msg) => dbLogger.info(msg),
    define: {
      /*       createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at', */
      timestamps: true, //开启时间戳
      underscored: true, //开启下划线
      charset: 'utf8',
      // freezeTableName: true, //固定表名为单数，默认是xxxs
    },
    timezone: '+08:00', //更改为北京时间
  }
)

const db = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    if (config.server.env === 'dev') {
      //开发环境根据模型同步创建表,生产环境需关闭
      /* 
        User.sync({ alter: true }) 
         这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),
         然后在表中进行必要的更改以使其与模型匹配.
        */
      await sequelize.sync({ alter: true })
      console.log('模型表刚刚或重新创建成功！')
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export default db


/* 
hasOne - 添加外键到目标模型，并以单数关系混入到源模型
belongsTo - 为当前模型添加外键，并以单数关系混入到源模型
hasMany - 添加外键到目标模型，并以复数关系混入到源模型
belongsToMany - 为连接的表创建N:M关系并以复数关系混入到源模型。会通过sourceId和targetId创建交叉表。
*/
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  Default,
  HasMany,
} from 'sequelize-typescript'

import { v4 as uuidv4 } from 'uuid'
import Article from './article'

// @Table({ modelName: 'user-ad' }) 自定义表名
//须使用默认暴露
@Table
export default class User extends Model {
  //主键
  @IsUUID(4)
  @Default(uuidv4())
  @PrimaryKey
  // @AutoIncrement  //自动递增
  @Column
  id!: string

  @Column
  email?: string

  @Column
  password?: string

  @Column
  username?: string

  @Column
  bio?: string

  @Column
  image?: string

  @Default(false)
  @Column
  following?: boolean

  @HasMany(() => Article)
  articles?: Article[]
}

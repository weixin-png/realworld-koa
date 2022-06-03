import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Article from './article'
import User from './user'

@Table
export default class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @ForeignKey(() => User)
  @Column
  user_id!: string

  @ForeignKey(() => Article)
  @Column
  article_id!: number

  //评论内容
  @Column
  body?: string

  @BelongsTo(() => User)
  author!: User

  @BelongsTo(() => Article)
  article?: Article
  
}

import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Article from './article'

//点赞表
@Table
export default class Favorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  //文章的id
  @ForeignKey(() => Article)
  @Column
  articleId!: number

  //用户的id
  @Column
  userId?: string

  @BelongsTo(() => Article)
  article!: Article
}

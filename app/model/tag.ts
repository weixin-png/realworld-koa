import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Article from './article'

@Table
export default class Tag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  name!: string

  @ForeignKey(() => Article)
  @Column
  articleId!: number

  @BelongsTo(() => Article)
  article!: Article
}

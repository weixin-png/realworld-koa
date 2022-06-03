import {
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Comment from './comment'
import Favorite from './favorite'

import Tag from './tag'
import User from './user'

@Table
export default class Article extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number //文章的id

  //作为关联user表的外键
  @ForeignKey(() => User)
  @Column
  userId!: string

  @Column
  title!: string //标题

  @Column
  description!: string //描述

  @Column
  body!: string //内容

  @HasMany(() => Tag)
  tags!: Tag[] //文章对应的标签

  @HasMany(() => Favorite)
  favorited?: Favorite[] //被谁点赞

  @Default(0)
  @Column
  favoritesCount?: number //被点赞的数量

  @BelongsTo(() => User)
  author!: User //作者

  @HasMany(() => Comment)
  commnets?: Comment[] //评论列表
}

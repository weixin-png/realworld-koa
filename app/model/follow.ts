import {
  Column,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { v4 } from 'uuid'

@Table
export default class Follow extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(v4())
  @Column
  id?: string

  //关注状态
  @Default(true)
  @Column
  following?: boolean

  //用户的id
  @Column
  userId?: string

  //被关注人的id
  @Column
  followedUserId?: string
}

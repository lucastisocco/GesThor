import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

export abstract class BaseEntity {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number

  /*
    @Property({ onCreate: () => new Date() })
    createdAt = new Date()
  
    @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
    updatedAt = new Date()
  */
}
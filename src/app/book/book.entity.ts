import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn() // -- Primary key
  id: number;

  @Column() // -- default column
  title: string;

  @Column()
  author: string;

  @Column()
  year: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // -- akan mengisi column ketika dibikin
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

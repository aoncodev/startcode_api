import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CourseBlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  body: string;

  @Column() // Assuming createdBy is optional
  createdBy: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  modifiedAt: Date;
}

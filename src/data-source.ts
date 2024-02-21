import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { CourseBlog } from "./entity/Course";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, CourseBlog],
  migrations: [],
  subscribers: []
});

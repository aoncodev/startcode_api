import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
dotenv.config();

import userController from "./router/users";
import login from "./router/login";
import courseBlog from "./router/courses/course";

const app = express();
AppDataSource.initialize()
  .then(async () => {
    console.log("DB initialized!");
  })
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use("/api", userController);
app.use("/api", login);
app.use("/api", courseBlog);
app.listen(3000);
console.log("Express server has started on port 3000");

import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import UserController from "./router/UserController";

const app = express();
AppDataSource.initialize()
  .then(async () => {
    console.log("DB initialized!");
  })
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use("/api", UserController);
app.listen(3000);
console.log("Express server has started on port 3000");

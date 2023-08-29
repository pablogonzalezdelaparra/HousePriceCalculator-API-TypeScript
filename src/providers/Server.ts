import express, { Request, Response } from "express";
import AbstractController from "../controllers/AbstractController";
// import db from '../models';
import mongoose from "mongoose";

class Server {
  //Atributos
  private app: express.Application;
  private port: number;
  private mongoUri: string;
  private env: string;

  //Metodos
  constructor(appInit: {
    port: number;
    env: string;
    middlewares: any[];
    controllers: AbstractController[];
    mongoUri: string;
  }) {
    this.app = express();
    this.port = appInit.port;
    this.env = appInit.env;
    this.loadMiddlewares(appInit.middlewares);
    this.loadControllers(appInit.controllers);
    this.mongoUri = appInit.mongoUri;
  }

  private loadMiddlewares(middlewares: any[]): void {
    middlewares.forEach((middleware: any) => {
      this.app.use(middleware);
    });
  }

  private loadControllers(controllers: AbstractController[]) {
    controllers.forEach((controller: AbstractController) => {
      this.app.use(`/${controller.prefix}`, controller.router);
    });
  }

  // Connect to the database
  public connect(): void {
    mongoose
      .connect(this.mongoUri, {})
      .then(() => {
        console.log("Successfully connected to MongoDB 🌿");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Disconnect from the database
  public disconnect(): void {
    mongoose.disconnect().then(() => {});
  }

  public async init() {
    // await db.sequelize.sync();
    this.app.listen(this.port, () => {
      console.log(`Server:Running 🚀 @'http://localhost:${this.port}'`);
    });

    //db.sequelize.sync()
    //    .then()
  }
}

export default Server;

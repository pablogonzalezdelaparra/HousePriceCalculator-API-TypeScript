import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { Model } from "mongoose";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";

class UserController extends AbstractController {
  private readonly _userModel: Model<IUser> = UserModel;
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }
  // protected initRoutes(): void {
  //     throw new Error("Method not implemented.");
  // }

  // Singleton
  private static instance: UserController;
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserController("user");
    return this.instance;
  }

  // Configurar las rutas del controlador
  protected initRoutes(): void {
    this.router.post(
      "/createUser",
      this.authMiddleware.verifyToken,
      this.createUser.bind(this)
    );
  }

  // Los métodos asociados a las rutas
  private async createUser(req: Request, res: Response) {
    try {
      res.status(200).send({ message: "User created succesfully!" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
}

export default UserController;

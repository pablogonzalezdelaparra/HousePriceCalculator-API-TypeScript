import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";
import { Model, HydratedDocument } from "mongoose";

class AuthenticationController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }

  private readonly _model: Model<IUser> = UserModel;

  // Singleton
  private static instance: AuthenticationController;
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new AuthenticationController("auth");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post("/signup", this.signup.bind(this));
    this.router.post("/verify", this.verify.bind(this));
    this.router.post("/signin", this.signin.bind(this));
  }

  private async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const login = await this.cognitoService.signInUser(email, password);
      res.status(200).send({ ...login.AuthenticationResult });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
  private async verify(req: Request, res: Response) {
    const { email, code } = req.body;
    try {
      await this.cognitoService.verifyUser(email, code);
      return res.status(200).send({ message: "Correct verification" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  private async signup(req: Request, res: Response) {
    const { email, password, name } = req.body;
    try {
      // Crear el usuario de cognito
      const user = await this.cognitoService.signUpUser(email, password, [
        {
          Name: "email",
          Value: email,
        },
      ]);
      // Creación del usuario dentro de la BDNoSQL-MongoDB
      const created_user: HydratedDocument<IUser> | null =
        await this._model.create(
          new UserModel({
            name: name,
            email: email,
            awsCognito: user.UserSub,
          })
        );

      if (!created_user) {
        throw "Failed to create user in MongoDB!";
      }
      res.status(201).send({ message: "User signedup" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
}

export default AuthenticationController;

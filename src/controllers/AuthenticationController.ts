import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";
// import db from "../models"; // BD realcional
import { verify } from "crypto";
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
    this.router.get(
      "/test",
      this.authMiddleware.verifyToken,
      this.test.bind(this)
    );
    this.router.get(
      "/testTokenRole",
      this.authMiddleware.verifyToken,
      this.permissionMiddleware.checkIsCreador,
      this.testTokenRole.bind(this)
    );
  }

  private async testTokenRole(req: Request, res: Response) {
    res
      .status(200)
      .send("Esto es una prueba de verificación de token y Role")
      .end();
  }

  private async test(req: Request, res: Response) {
    res.status(200).send("Esto es una prueba de verificación").end();
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
    const { email, password, name, role } = req.body;
    try {
      console.log("Hello");
      // Create el usuario de cognito
      const user = await this.cognitoService.signUpUser(email, password, [
        {
          Name: "email",
          Value: email,
        },
      ]);
      console.log("cognito user created", user);
      // Creación del usuario dentro de la BDNoSQL-DynamoDB
      const customer: HydratedDocument<IUser> | null =
      await this._model.create(
        new UserModel({
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          awsCognito: user.UserSub,
        })
      );

    if (!customer) {
      throw "Failed to create user";
    }
  res.status(201).send({ message: "User signedup" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  // protected validateBody(type: any){}
}

// import { Request, Response } from "express";
// import { checkSchema } from "express-validator";
// import AbstractController from "./AbstractController";
// import UserModel from "../modelsNOSQL/userNOSQL"; // BD no relacional
// import db from "../models"; // BD relacional

// class AuthenticationController extends AbstractController {
//   // Singleton
//   private static instance: AuthenticationController;
//   public static getInstance(): AbstractController {
//     if (this.instance) {
//       return this.instance;
//     }
//     this.instance = new AuthenticationController("auth");
//     return this.instance;
//   }

//   protected initRoutes(): void {
//     this.router.post("/signup");
//     //   this.router.post('/verify', )
//     //   this.router.post('/signin', )
//   }

//   private async signup(req:Request, res:Response){
//     const {email, password, name, role} = req.body;
//     try{

//     }
//   }
// }
export default AuthenticationController;

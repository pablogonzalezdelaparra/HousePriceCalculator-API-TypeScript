import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { Model } from "mongoose";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";

class RecaudacionController extends AbstractController {
  private readonly _model: Model<IUser> = UserModel;
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }
  // protected initRoutes(): void {
  //     throw new Error("Method not implemented.");
  // }

  // Singleton
  private static instance: RecaudacionController;
  public static getInstance(): AbstractController {
    // si existe la instancia la regreso
    if (this.instance) {
      return this.instance;
    }
    // si no existe, la creo
    this.instance = new RecaudacionController("recaudacion");
    return this.instance;
  }

  // Configurar las rutas del controlador
  protected initRoutes(): void {
    // bind establece un vínculo con la función que estamos declarando
    // dentro de la clase y, en este caso, el elemento this
    this.router.post(
      "/updateRecaudacion",
      this.authMiddleware.verifyToken,
      this.permissionMiddleware.checkIsCreador,
      this.updateRecaudacion.bind(this)
    );
    this.router.post("/donar/:mail", this.donar.bind(this));
    this.router.get("/revisarTotal/:mail", this.revisarTotal.bind(this));
    this.router.get(
      "/revisarTotalDonaciones",
      this.revisarTotalDonaciones.bind(this)
    );
    // this.router.post("/createUser", this.postCreateUser.bind(this))
  }

  // Los métodos asociados a las rutas
  private async updateRecaudacion(req: Request, res: Response) {
    try {
      const recaudacion: IUser | null = await this._model.findOneAndUpdate(
        { awsCognito: req.user },
        {
          proposito: req.body.proposito,
          meta: req.body.meta,
        }
      );

      if (!recaudacion) {
        throw "No se encontró la recaudación";
      }

      // const login = await this.cognitoService.signInUser(email,password);
      res.status(200).send({ result: recaudacion });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  // Los métodos asociados a las rutas
  private async donar(req: Request, res: Response) {
    try {
      const recaudacion: IUser | null = await this._model.findOneAndUpdate(
        { email: req.params.mail },
        {
          $inc: { total: req.body.monto },
        }
      );

      if (!recaudacion) {
        throw "No se encontró la recaudación";
      }

      // const login = await this.cognitoService.signInUser(email,password);
      res.status(200).send({ result: recaudacion });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  // Los métodos asociados a las rutas
  private async revisarTotal(req: Request, res: Response) {
    try {
      const recaudacion: IUser | null = await this._model.findOne({
        email: req.params.mail,
      });

      if (!recaudacion) {
        throw "No se encontró la recaudación";
      }

      // const login = await this.cognitoService.signInUser(email,password);
      res.status(200).send({ total: recaudacion.total });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  // Los métodos asociados a las rutas
  private async revisarTotalDonaciones(req: Request, res: Response) {
    try {
      const recaudacion: IUser[] | null = await this._model.find(
        {},
        { total: 1 }
      );

      if (!recaudacion) {
        throw "No se encontró la recaudación";
      }

      const totalSum = recaudacion.reduce((acc, item) => acc + item.total, 0);

      res.status(200).send({ result: totalSum });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
}

export default RecaudacionController;

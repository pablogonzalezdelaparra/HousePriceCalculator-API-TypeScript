import { Response, Request, NextFunction } from "express";
// Models
import IUser, { UserModel, UserRoles } from "../modelsNOSQL/userMongo";
import { HydratedDocument } from "mongoose";

export default class PermissionMiddleware {
  // Singleton
  private static instance: PermissionMiddleware;
  public static getInstance(): PermissionMiddleware {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new PermissionMiddleware();
    return this.instance;
  }

  /**
   * Verify that the current user is an Supervisor
   */
  public async checkIsCreador(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customer: HydratedDocument<IUser> | null = await UserModel.findOne({
        awsCognito: req.user,
      });

      if (!customer) {
        throw "Failed to find user";
      }

      if (customer.role === UserRoles.CREATOR) {
        console.log("Es creador");
        next();
      } else {
        res.status(401).send({
          code: "UserNotSupervisorException",
          message: "The logged account is not a supervisor",
        });
      }
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
}

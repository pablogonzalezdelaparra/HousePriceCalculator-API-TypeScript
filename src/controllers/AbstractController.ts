import { Router } from "express";
import { AWSError, CognitoIdentityServiceProvider } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

// Middlewares
import ValidationErrorMiddleware from "../middlewares/validationError";
import AuthMiddleware from "../middlewares/authorization";
import PermissionMiddleware from "../middlewares/permission";

// Servicios
import CognitoService from "../services/cognitoService";

export default abstract class AbstractController{
    // Atributos (si lleva _ es un atributo)
    private _router: Router = Router();
    private _prefix: string;     // El prefijo es la manera en la que se accede a las rutas

    protected handleErrors = ValidationErrorMiddleware.handleErrors;
    protected authMiddleware = AuthMiddleware.getInstance();
    protected permissionMiddleware = PermissionMiddleware.getInstance();
    protected cognitoService = CognitoService.getInstance();


    public get router(): Router{
        return this._router;
    }

    public get prefix(): string{
        return this._prefix;
    }

    protected constructor(prefix: string){
        this._prefix = prefix;
        this.initRoutes();
    }

    // Inicializar las rutas
    protected abstract initRoutes(): void;

    // Validar el body de la petición
    protected abstract validateBody(type: any): any;
}

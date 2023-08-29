import express from 'express';
import cors from 'cors';
import UserController from "./controllers/RecaudacionController";
import AuthenticationController from "./controllers/AuthenticationController";
import Server from "./providers/Server";
import {MONGODB_URI} from "./config";
import RecaudacionController from './controllers/RecaudacionController';


const servidor = new Server({
    port:8080,
    middlewares:[
        express.json(),
        express.urlencoded({extended:true}),
        cors()
    ],
    controllers:[
        UserController.getInstance(),
        AuthenticationController.getInstance(),
        RecaudacionController.getInstance()
    ],
    env:'development',
    mongoUri: MONGODB_URI,


});

declare global{
    namespace Express{
        interface Request{
            user:string;
            token:string;
        }
    }
}

servidor.connect();

servidor.init();

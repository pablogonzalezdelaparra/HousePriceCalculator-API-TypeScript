import dynamodb from "../services/dynamoService";
import joi from 'joi';
import { PREFIX_TABLE } from "../config";

export enum UserRoles{
    CREATOR='creator'
}

const UserModel = dynamodb.define('usuario',{
   hashKey:'awsCognitoId',
   timestamps:true,
   schema:{
    awsCognitoId: joi.string().required(),
    awsCognito:joi.string().required(),
    name:joi.string().required(),
    role:joi.string().required().default(UserRoles.CREATOR),
    email:joi.string().required().email(),
    proposito:joi.string(),
    meta:joi.number(),
    total:joi.number().default(0)
   },
   tableName:`Usuario${PREFIX_TABLE}`,
   indexes:[
    {
        hashKey:'email',
        name:"EmailIndex",
        type:'global'
    },
    {
        hashKey:'awsCognito',
        name:"awsCognitoIndex",
        type:'global'
    }
   ] 
});

//Solo ejecutar la primera vez y despues comentar
// dynamodb.createTables((err:any)=>{
//     console.log('funcion crear tabla');
    
//     if(err) 
//         return console.log('Error al crear la tabla:',err)
//     console.log('Tabla creada exitosamente')
// })

export default UserModel;


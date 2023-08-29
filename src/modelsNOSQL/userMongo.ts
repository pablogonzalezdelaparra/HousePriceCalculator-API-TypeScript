import mongoose from 'mongoose';
import { Schema ,Types, model } from "mongoose";

import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

export const UserRoles = {
  CREATOR: 'creator',
};

export interface IUser {
    awsCognito: string;
    name: string;
    role: string;
    email: string;
    proposito: string;
    meta: number;
    total: number;
  }

export const userSchema = new Schema<IUser>(
  {
    awsCognito: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: UserRoles.CREATOR,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    proposito: String,
    meta: Number,
    total: {
      type: Number,
      default: 0,
      required: false
    },
  }
);

userSchema.index({ email: 1 }, { name: 'EmailIndex' });
userSchema.index({ awsCognito: 1 }, { name: 'awsCognitoIndex' });

export const UserModel = model<IUser>('User', userSchema);
export default IUser;
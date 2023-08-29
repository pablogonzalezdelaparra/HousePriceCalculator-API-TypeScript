import { Schema, model } from "mongoose";

export const UserRoles = {
  ADMIN: "admin",
  USER: "user",
};

export interface IUser {
  awsCognito: string;
  name: string;
  role: string;
  email: string;
}

export const userSchema = new Schema<IUser>({
  awsCognito: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: UserRoles.USER,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export const UserModel = model<IUser>("User", userSchema);
export default IUser;

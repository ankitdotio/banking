import type { Model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;
}

export interface IUserMethods {
  comparePasswords(password: string): Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type typeUserModel = Model<IUser, {}, IUserMethods>;

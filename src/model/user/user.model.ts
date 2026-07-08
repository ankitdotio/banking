import * as argon2 from "argon2";
import mongoose from "mongoose";
import type { IUser, IUserMethods, typeUserModel } from "./user.types.js";

const userSchema = new mongoose.Schema<IUser, typeUserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, "USER NAME IS REQUIRED"],
      unique: [true, "USERNAME SHOULD BE UNIQUE"],
    },
    email: {
      type: String,
      required: [true, "EMAIL IS REQUIRED"],
      unique: [true, "EMAIL SHOULD BE UNIQUE"],
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "INVALID EMAIL ADDRESS",
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "PASSWORD IS REQUIRED"],
      minLength: [6, "PASSWORD SHOULD CONTAIN MORE THAN 6 CHARACTERS"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);
  this.password = hash;

  return;
});

userSchema.methods.comparePasswords = async function (
  password: string,
): Promise<boolean> {
  console.log("Stored password:", this.password);
  console.log("Type:", typeof this.password);

  return await argon2.verify(this.password, password);
};

export const userModel = mongoose.model("user", userSchema);

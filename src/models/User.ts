import { Document, Model, model, Schema } from "mongoose";
import { IContact } from "./Contact";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  contacts: IContact[];
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: false,
      default: () => ({}),
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

// @ts-ignore
const User: Model<IUser> = model("User", userSchema);

export default User;

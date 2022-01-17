import { Document, Model, model, Schema } from "mongoose";

export interface ILabel extends Document {
  name: string;
  color: string;
}

const labelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: "#000000",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export interface IPhone extends Document {
  contact: IContact["_id"];
  countryCode: string;
  label: string;
  number: string;
}

const phoneSchema: Schema = new Schema({
  contact: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
  },
  countryCode: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
    default: "mobile",
  },
  number: {
    type: String,
    required: false,
  },
});

/**
 * Interface to model the Contact Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
export interface IContact extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  avatar: string;
  email: string;
  isFavorite: boolean;
  company: string;
  jobTitle: string;
  phones: IPhone[];
  labels: ILabel[];
}

const contactSchema: Schema = new Schema({
  email: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  jobTitle: {
    type: String,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  isFavorite: {
    type: Boolean,
    required: false,
    default: false,
  },
  phones: [{ type: phoneSchema, default: () => ({}) }],
  labels: [{ type: labelSchema, default: () => ({}) }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

// @ts-ignore
const Phone: Model<IPhone> = model("Phone", phoneSchema);
// @ts-ignore
const Label: Model<ILabel> = model("Label", labelSchema);
// @ts-ignore
const Contact: Model<IContact> = model("Contact", contactSchema);

export default Contact;
export { Phone, Label };

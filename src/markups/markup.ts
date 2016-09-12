import * as Mongoose from "mongoose";

export interface IMarkup extends Mongoose.Document {
  userId: string;
  partnerId: string;
  name: string;
  content: string;
  postUrl: string;
  createdAt: Date;
  updateAt: Date;
};

export const MarkupSchema = new Mongoose.Schema({
  userId: { type: String, required: true },
  partnerId: { type: String, required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  postUrl: { type: String, required: true }
}, {
    timestamps: true
  });

export const MarkupModel = Mongoose.model<IMarkup>('Markup', MarkupSchema);

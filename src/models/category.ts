import mongoose from 'mongoose';
import { Document, model } from 'mongoose';

export interface ICategory extends Document {
  name: string,
  icon: string,
  description: string,
  position: number,
  color: string,
  deletedAt: Date
}

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  description: { type: String, required: false },
  position: { type: Number, required: false },
  color: { type: String, required: false },
  deletedAt: { type: Date, required: false, default: null },
});

const Category = model<ICategory>('Categories', schema);

export default Category;

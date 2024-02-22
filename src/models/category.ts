import mongoose from 'mongoose';
import { Document, model } from 'mongoose';

export interface ICategory extends Document {
  name: string,
  icon: string,
  description: string,
  position: number,
}

const schema = new mongoose.Schema({
  name: String,
  icon: String,
  description: String,
  position: Number
});

const Category = model<ICategory>('Categories', schema);

export default Category;

import mongoose from 'mongoose';
import { Document, ObjectId, model } from 'mongoose';

interface ITransaction extends Document {
  accountId: ObjectId;
  categoryId: ObjectId;
  amount: number;
  type: 'Expense' | 'Income';
  date: Date;
  description: string;
}

const schema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  amount: Number,
  type: { type: String, enum: ['Expense', 'Income'] },
  date: Date,
  description: String
});

const Transaction = model<ITransaction>('Transactions', schema);

export default Transaction;

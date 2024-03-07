import mongoose from 'mongoose';
import { Document, ObjectId, model } from 'mongoose';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export interface ITransaction extends Document {
  accountId: ObjectId;
  categoryId: ObjectId;
  amount: number;
  type: TransactionType;
  date: Date;
  description: string;
  currency: string;
}

const schema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  amount: Number,
  type: {
    type: String,
    enum: Object.values(TransactionType)
  },
  date: Date,
  description: String,
  currency: String,
});

const Transaction = model<ITransaction>('Transactions', schema);

export default Transaction;

import mongoose from 'mongoose';
import { Document, ObjectId, model } from 'mongoose';

export enum AccountType {
  CREDIT_CARD = 'credit card',
  INVESTMENT = 'investment',
  SAVINGS = 'savings',
  BANK_ACCOUNT = 'bank account',
  CASH = 'cash',
  CRYPTO = 'crypto'
}
export interface IAccount extends Document {
  userId: ObjectId,
  title: string,
  description: string,
  balance: number,
  currency: string,
  type: AccountType,
  deletedAt: Date | null
}

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  balance: Number,
  currency: String,
  type: {
    type: String,
    enum: Object.values(AccountType)
  },
  deletedAt: { type: Date, default: null },
},
{
  timestamps: true
});

const Account = model<IAccount>('Accounts', schema);

export default Account;
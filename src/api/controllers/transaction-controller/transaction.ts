import Router from 'koa-router';
import { Context } from 'koa';
import Transaction, { TransactionType } from '../../../models/transaction';
import { validateId } from '../../../middleware/validation';
import { createTransactionSchema, updateTransactionSchema } from './transaction-schema';
import { ObjectId } from 'mongoose';

interface UpdateTransactionRequest {
  accountId?: ObjectId;
  categoryId?: ObjectId;
  amount?: number;
  type?: TransactionType;
  date?: Date;
  description? : string;
}

const createTransaction = async (ctx: Context) => {
  const { value, error } = createTransactionSchema.validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
    const transaction = new Transaction(value);
    transaction.date = new Date(value.date);
    await transaction.save();
    ctx.status = 201;
    ctx.body = transaction;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const getUserTransactions = async (ctx: Context) => {
  try {
    const transactions = await Transaction.find({});
    ctx.body = transactions;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const getUserTransactonById = async (ctx: Context) => {
  try {
    const transaction = await Transaction.findById(ctx.params.id);
    if (!transaction) {
      ctx.throw(404, 'Transaction not found');
    }
    ctx.body = transaction;
  } catch (error) {
    ctx.body = error;
  }
};

const updateTransation = async (ctx: Context) => {
  const { value, error } = updateTransactionSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      ctx.params.id,
      value as UpdateTransactionRequest,
      { new: true }
    );
    if (!transaction) {
      ctx.throw(404, 'Transaction not found');
    }
    ctx.body = transaction;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const deleteTransaction = async (ctx: Context) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(ctx.params.id);
    if (!transaction) {
      ctx.throw(404, 'Transaction not found');
    }
    ctx.status = 200;
    ctx.body = 'Transaction deleted';
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const exportTransactions = async (ctx: Context) => {
  console.log('export');
}

const transactionRoutes = new Router();

transactionRoutes.post('/transaction', createTransaction);
transactionRoutes.get('/transactions', getUserTransactions);
transactionRoutes.get('/export-transactions', exportTransactions);
transactionRoutes.get('/transaction/:id', validateId, getUserTransactonById);
transactionRoutes.delete('/transaction/:id', validateId, deleteTransaction);
transactionRoutes.put('/transaction/:id', validateId, updateTransation);

export default transactionRoutes;

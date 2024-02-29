import Router from 'koa-router';
import { Context } from 'koa';
import Transaction, { TransactionType } from '../../../models/transaction';
import { validateId } from '../../../middleware/validation';
import { createTransactionSchema, updateTransactionSchema } from './transaction-schema';
import { ObjectId } from 'mongoose';
import { parse } from 'json2csv';
import { convertToSubunits } from '../../../utils/utils';

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

    if (value.currency) {
      value.balance = convertToSubunits(value.balance, value.currency);
    }

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

    if (value.currency) {
      value.balance = convertToSubunits(value.balance, value.currency);
    }

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
  try {
    const data = await Transaction.find( { accountId: ctx.params.id } ).lean().exec();

    const csv = parse(data);

    ctx.set('Content-disposition', 'attachment; filename=data.csv');
    ctx.set('Content-Type', 'text/csv');

    ctx.body = csv;

  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Failed to export CSV';
  }
}

const transactionRoutes = new Router();

transactionRoutes.post('/transaction', createTransaction);
transactionRoutes.get('/transactions', getUserTransactions);
transactionRoutes.get('/export-transactions/:id', validateId, exportTransactions);
transactionRoutes.get('/transaction/:id', validateId, getUserTransactonById);
transactionRoutes.delete('/transaction/:id', validateId, deleteTransaction);
transactionRoutes.put('/transaction/:id', validateId, updateTransation);

export default transactionRoutes;

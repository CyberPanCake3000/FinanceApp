import Router from 'koa-router';
import { Context } from 'koa';
import Transaction, { TransactionType } from '../../../models/transaction';
import { validateId } from '../../../middleware/validation';
import { createTransactionSchema, updateTransactionSchema } from './transaction-schema';
import { ObjectId } from 'mongoose';
import { parse } from 'json2csv';
import { convertFromSubunits, convertToSubunits } from '../../../utils/utils';
import { TransactionsService } from '../../../services/transactions-service/transactions-service';

interface UpdateTransactionRequest {
  accountId?: ObjectId;
  categoryId?: ObjectId;
  amount?: number;
  type?: TransactionType;
  date?: Date;
  description? : string;
  currency?: string;
}

const createTransaction = async (ctx: Context) => {
  const { value, error } = createTransactionSchema.validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = error;
    return;
  }

  try {
    const transactionValue = {
      ...value,
      amount: value.currency ? convertToSubunits(value.amount, value.currency) : value.amount,
      date: new Date(value.date)
    };

    const transaction = await new Transaction(transactionValue).save();
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
    transactions.forEach(transaction => {
      if (transaction.currency) {
        transaction.amount = convertFromSubunits(transaction.amount, transaction.currency);
      }
    });
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

    if (transaction.currency) {
      transaction.amount = convertFromSubunits(transaction.amount, transaction.currency);
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
    ctx.body = error;
    return;
  }

  try {

    if (value.currency) {
      value.amount = convertToSubunits(value.amount, value.currency);
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

export const exportTransactions = async (ctx: Context) => {
  try {
    const accountId = ctx.params.id;

    const transactionsService = new TransactionsService({
      transactionModel: Transaction,
    });

    const raw = await transactionsService.exportTransactionsToCSV(accountId);

    const csv = parse(raw);

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

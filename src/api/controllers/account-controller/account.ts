import { Context } from 'koa';
import Router from 'koa-router';
import { validateId, validateCurrency } from '../../../middleware/validation';
import { createAccountSchema, updateAccountSchema } from './account-schemas';
import Account, { AccountType } from '../../../models/account';
import { ObjectId } from 'mongoose';
import { convertToSubunits, convertFromSubunits } from '../../../utils/utils';
import Transaction from '../../../models/transaction';
import { TransactionsService } from '../../../services/transactions-service/transactions-service';
import { AccountsService } from '../../../services/accounts-service/accounts-service';

interface UpdateAccountRequest {
  userId?: ObjectId,
  title?: string,
  description?: string,
  balance?: number,
  currency?: string,
  type?: AccountType,
  deletedAt?: Date | null
}

const createAccount = async (ctx: Context) => {
  const { value, error } = createAccountSchema.validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
    if (value.currency) {
      value.balance = convertToSubunits(value.balance, value.currency);
    }

    const account = new Account(value);
    await account.save();
    ctx.status = 201;
    ctx.body = account;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
}

const getAccounts = async (ctx: Context) => {
  try {
    const accounts = await Account.find({});

    accounts.forEach(account => {
      account.balance = convertFromSubunits(account.balance, account.currency);
    });

    ctx.body = accounts;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
}

const getAccountById = async (ctx: Context) => {
  try {
    const account = await Account.findById(ctx.params.id);

    if (account) {
      account.balance = convertFromSubunits(account.balance, account.currency);
    } else {
      ctx.throw(404, 'Account not found');
    }

    ctx.body = account;
  } catch (error) {
    ctx.body = error;
  }
}

const updateAccount = async (ctx: Context) => {
  const { value, error } = updateAccountSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
    if (value.currency) {
      value.balance = convertToSubunits(value.balance, value.currency);
    }

    const account = await Account.findByIdAndUpdate(
      ctx.params.id,
      value as UpdateAccountRequest,
      { new: true }
    );
    if (!account) {
      ctx.throw(404, 'Account not found');
    }
    ctx.body = account;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
}

const getAccountTransactions = async (ctx: Context) => {
  try {
    const accountId = ctx.params.id;

    const accountService = new AccountsService({
      transactionModel: Transaction,
    });

    const transactions = await accountService.getAccountTransactions(accountId);

    ctx.status = 200;
    ctx.body = transactions;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
}

const deleteAccount = async (ctx: Context) => {
  try {
    const account = await Account.findById(ctx.params.id);

    if (!account) {
      ctx.throw(404, 'Account not found');
    }

    if (account.deletedAt) {
      ctx.status = 409;
      ctx.body = 'Account already deleted';
      return;
    }

    await Account.findByIdAndUpdate(
      ctx.params.id,
      { deletedAt: new Date()}
    );

    ctx.status = 200;
    ctx.body = "Account deleted";
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
}

const accountRoutes = new Router();

accountRoutes.post('/account', validateCurrency, createAccount);
accountRoutes.get('/accounts', getAccounts);
accountRoutes.get('/account/:id', validateId, getAccountById);
accountRoutes.get('/account-history/:id', validateId, getAccountTransactions);
accountRoutes.delete('/account/:id', validateId, deleteAccount);
accountRoutes.put('/account/:id', validateId, validateCurrency, updateAccount);

export default accountRoutes;



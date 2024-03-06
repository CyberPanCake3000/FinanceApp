import Account from '../../models/account';
import Transaction from '../../models/transaction';
import { convertFromSubunits } from '../../utils/utils';

interface AccountServiceDependencies {
  accountModel: typeof Account,
  transactionModel: typeof Transaction,
}

export class AccountsService {
  private accountModel: typeof Account;
  private transactionModel: typeof Transaction;

  constructor(dependecies: AccountServiceDependencies) {
    this.accountModel = dependecies.accountModel;
    this.transactionModel = dependecies.transactionModel;
  }

  async getAccountTransactions(accountId?: string) {
    if (!accountId) {
      throw new Error('Incorrect account ID')
    }

    const account = await this.accountModel.findById(accountId);

    if (!account) {
      throw new Error('Account not found')
    }

    const accountTransactions = await this.transactionModel.find({ accountId });

    accountTransactions.forEach(transaction => {
      transaction.amount = convertFromSubunits(transaction.amount, account.currency);
    });

    return accountTransactions;
  }
}
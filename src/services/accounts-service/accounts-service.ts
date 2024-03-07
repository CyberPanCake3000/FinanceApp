import Account from '../../models/account';
import Transaction from '../../models/transaction';
import { convertFromSubunits } from '../../utils/utils';

interface AccountServiceDependencies {
  transactionModel: typeof Transaction,
}

export class AccountsService {
  private transactionModel: typeof Transaction;

  constructor(dependecies: AccountServiceDependencies) {
    this.transactionModel = dependecies.transactionModel;
  }

  async getAccountTransactions(accountId?: string) {
    if (!accountId) {
      throw new Error('Incorrect account ID')
    }

    const accountTransactions = await this.transactionModel.find({ accountId });

    accountTransactions.forEach(transaction => {
      transaction.amount = convertFromSubunits(transaction.amount, transaction.currency);
    });

    return accountTransactions;
  }
}
import Transaction from '../../models/transaction';
import { Types } from 'mongoose';

interface TransactionsServiceDependencies {
  transactionModel: typeof Transaction,
}

export class TransactionsService {
  private transactionModel: typeof Transaction;

  constructor (dependecies: TransactionsServiceDependencies) {
    this.transactionModel = dependecies.transactionModel;
  }

  async exportTransactionsToCSV(accountId?: string) {
    if (!accountId) {
      throw new Error('Incorrect account ID')
    }

    const accountObjectId = new Types.ObjectId(accountId);

    const transactionsWithCategories = await this.transactionModel.aggregate(
      [
        {
          $match:
          {
            accountId: accountObjectId,
          },
        },
        {
          $lookup:
          {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind:
          {
            path: "$categoryInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project:
          {
            "Transaction ID": "$_id",
            "Account ID": "$accountId",
            "Category ID": "$categoryId",
            "Category name": "$categoryInfo.name",
            Amount: "$amount",
            Type: "$type",
            Date: "$date",
            Description: "$description",
          },
        },
      ]

    );

    return transactionsWithCategories;
  }
}
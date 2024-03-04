import Transaction from '../../models/transaction';
import Category from '../../models/category';

interface TransactionsServiceDependencies {
  transactionModel: typeof Transaction,
  categoryModel: typeof Category,
}

export class TransactionsService {
  private transactionModel: typeof Transaction;
  private categoryModel: typeof Category;

  constructor (dependecies: TransactionsServiceDependencies) {
    this.transactionModel = dependecies.transactionModel;
    this.categoryModel = dependecies.categoryModel;
  }

  async exportTransactionsToCSV(accountId?: string) {
    if (!accountId) {
      throw new Error('Incorrect account ID')
    }

    const transactions = await this.transactionModel.find({ accountId }).lean().exec();

    const categoriesMap = new Map();
    const categories = await this.categoryModel.find().lean().exec();
    categories.forEach(category => {
      categoriesMap.set(category._id.toString(), category.name);
    });

    const transactionsWithCategoryNames = transactions.map(transaction => ({
      ...transaction,
      categoryId: categoriesMap.get(transaction.categoryId.toString()) || '-',
    }));

    return transactionsWithCategoryNames;
  }
}
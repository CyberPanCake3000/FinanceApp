import { AccountsService } from './accounts-service';
import Account from '../../models/account';
import Transaction from '../../models/transaction';
import { convertFromSubunits } from '../../utils/utils';

jest.mock('../../models/account', () => ({
  findById: jest.fn()
}));

jest.mock('../../models/transaction', () => ({
  find: jest.fn()
}));

jest.mock('../../utils/utils', () => ({
  convertFromSubunits: jest.fn().mockImplementation((amount) => amount / 100)
}));

describe('AccountsService', () => {
  const mockedAccountModel = Account as jest.Mocked<typeof Account>;
  const mockedTransactionModel = Transaction as jest.Mocked<typeof Transaction>;
  const service = new AccountsService({ accountModel: mockedAccountModel, transactionModel: mockedTransactionModel });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if no accountId is provided', async () => {
    await expect(service.getAccountTransactions()).rejects.toThrow('Incorrect account ID');
  });

  it('should throw an error if account not found', async () => {
    mockedAccountModel.findById.mockResolvedValue(null);
    await expect(service.getAccountTransactions('someAccountId')).rejects.toThrow('Account not found');
  });

  it('should return converted account transactions', async () => {
    const mockAccountId = 'testAccountId';
    const mockAccount = { _id: mockAccountId, currency: 'USD' };
    const mockTransactions = [
      { accountId: mockAccountId, amount: 10000 },
    ];

    mockedAccountModel.findById.mockResolvedValue(mockAccount as any);
    mockedTransactionModel.find.mockResolvedValue(mockTransactions as any);

    const transactions = await service.getAccountTransactions(mockAccountId);

    expect(transactions[0].amount).toBe(100);
    expect(convertFromSubunits).toHaveBeenCalledWith(10000, 'USD');
  });
});

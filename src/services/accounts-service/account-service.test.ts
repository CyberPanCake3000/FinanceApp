import { AccountsService } from './accounts-service';
import Transaction from '../../models/transaction';
import * as utils from '../../utils/utils';

jest.mock('../../models/transaction', () => ({
  find: jest.fn(),
}));

jest.mock('../../utils/utils', () => ({
  convertFromSubunits: jest.fn().mockImplementation((amount) => amount),
}));

describe('AccountsService', () => {
  let service: AccountsService;
  const mockedTransactionModel = Transaction as jest.Mocked<typeof Transaction>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AccountsService({ transactionModel: mockedTransactionModel });
  });

  it('should throw an error if no accountId is provided', async () => {
    await expect(service.getAccountTransactions()).rejects.toThrow('Incorrect account ID');
  });

  it('should return converted account transactions', async () => {
    const mockTransactions = [
      { amount: 10000, currency: 'USD' },
    ];
    mockedTransactionModel.find.mockResolvedValue(mockTransactions as any);

    const mockAmount = 100;
    (utils.convertFromSubunits as jest.Mock).mockImplementation(() => mockAmount);

    const transactions = await service.getAccountTransactions('validAccountId');

    expect(mockedTransactionModel.find).toHaveBeenCalledWith({ accountId: 'validAccountId' });
    expect(transactions[0].amount).toBe(mockAmount);
    expect(utils.convertFromSubunits).toHaveBeenCalledWith(10000, 'USD');
  });
});

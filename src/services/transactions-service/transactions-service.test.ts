import { TransactionsService } from './transactions-service'

describe('TrasactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionModelMock: any;

  it('should return transactions with categories', async () => {
    // GIVEN
    const accountId = '5f8d4feac2ea0a1a9e456b5d'

    transactionModelMock = {
      aggregate: jest.fn().mockResolvedValueOnce([
        {
          "_id": "65d4bf46d86efa3b8841b438",
          "Transaction ID": "65d4bf46d86efa3b8841b438",
          "Account ID": "5f8d4feac2ea0a1a9e456b5d",
          "Category ID": "5f8d4feac2ea0a1a9e456b5e",
          "Amount": 150,
          "Type": "expense",
          "Date": "2024-02-20T00:00:00.000Z",
          "Description": "Grocery shopping at Supermarket"
        },
        {
          "_id": "65df6f05390d903146f56f52",
          "Transaction ID": "65df6f05390d903146f56f52",
          "Account ID": "5f8d4feac2ea0a1a9e456b5d",
          "Category ID": "65d88063ba61dc0fb76985e5",
          "Category name": "test validation",
          "Amount": 1230,
          "Type": "income",
          "Date": "2024-02-20T00:00:00.000Z",
          "Description": "avito"
        }
      ])
    }


    transactionsService = new TransactionsService({
      transactionModel: transactionModelMock,
    });

    // WHEN
    const result = await transactionsService.exportTransactionsToCSV(accountId);

    // THEN
    expect(result).toEqual([
      {
        "_id": "65d4bf46d86efa3b8841b438",
        "Transaction ID": "65d4bf46d86efa3b8841b438",
        "Account ID": "5f8d4feac2ea0a1a9e456b5d",
        "Category ID": "5f8d4feac2ea0a1a9e456b5e",
        "Amount": 150,
        "Type": "expense",
        "Date": "2024-02-20T00:00:00.000Z",
        "Description": "Grocery shopping at Supermarket"
      },
      {
        "_id": "65df6f05390d903146f56f52",
        "Transaction ID": "65df6f05390d903146f56f52",
        "Account ID": "5f8d4feac2ea0a1a9e456b5d",
        "Category ID": "65d88063ba61dc0fb76985e5",
        "Category name": "test validation",
        "Amount": 1230,
        "Type": "income",
        "Date": "2024-02-20T00:00:00.000Z",
        "Description": "avito"
      }
    ])
  })
})
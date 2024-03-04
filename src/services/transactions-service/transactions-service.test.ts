import { TransactionsService } from './transactions-service'

describe('TrasactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionModelMock: any;
  let categoryModelMock: any;

  beforeEach(() => {

  })

  it('should return transactions with categories', async () => {
    // GIVEN
    const accountId = 'account-id'

    transactionModelMock = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          _id: "65d4bf46d86efa3b8841b438",
          accountId: "5f8d4feac2ea0a1a9e456b5d",
          categoryId: "5f8d4feac2ea0a1a9e456b5e",
          amount: 150,
          type: "expense",
          date: "2024-02-20T00:00:00.000Z",
          description: "Grocery shopping at Supermarket",
        },
        {
          _id: "65df6f05390d903146f56f52",
          accountId: "5f8d4feac2ea0a1a9e456b5d",
          categoryId: "65d88063ba61dc0fb76985e5",
          amount: 1230,
          type: "income",
          date: "2024-02-20T00:00:00.000Z",
          description: "avito",
        }
      ])
    }


    categoryModelMock = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          _id: "65d88063ba61dc0fb76985e5",
          name: "test validation",
          icon: "",
          description: "new test for updating the category",
          position: 1,
          color: "fff",
        },
        {
          _id: "65d8850b32206e6b9173a293",
          name: "test1",
          icon: "",
          description: "fnldkmf",
          position: 1,
          color: "fff",
        }
      ])
    }

    transactionsService = new TransactionsService({
      transactionModel: transactionModelMock,
      categoryModel: categoryModelMock,
    });

    // WHEN
    const result = await transactionsService.exportTransactionsToCSV(accountId);

    // THEN
    expect(result).toEqual([
      {
        _id: "65d4bf46d86efa3b8841b438",
        accountId: "5f8d4feac2ea0a1a9e456b5d",
        categoryId: "-",
        amount: 150,
        type: "expense",
        date: "2024-02-20T00:00:00.000Z",
        description: "Grocery shopping at Supermarket",
      },
      {
        _id: "65df6f05390d903146f56f52",
        accountId: "5f8d4feac2ea0a1a9e456b5d",
        categoryId: "test validation",
        amount: 1230,
        type: "income",
        date: "2024-02-20T00:00:00.000Z",
        description: "avito",
      }
    ])
  })
})
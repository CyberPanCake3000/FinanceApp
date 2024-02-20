import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { Schema, model, connect, ObjectId } from 'mongoose';
import Transaction from './models/Transactions';
import 'dotenv/config'

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', async (ctx) => {
  await connect(process.env.MONGODB_CONNSTRING as string);
  const newT = new Transaction({
    accountId: "5f8d4feac2ea0a1a9e456b5d",
    categoryId: "5f8d4feac2ea0a1a9e456b5e",
    amount: 150.00,
    type: 'Expense',
    date: new Date("2024-02-20"),
    description: "Grocery shopping at Supermarket",
  });

  // await newT.save();
  ctx.body = 'Hello! this is new transaction:' + JSON.stringify(newT);
});

router.get('/hello', async (ctx) => {
  ctx.body = 'Hello!';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


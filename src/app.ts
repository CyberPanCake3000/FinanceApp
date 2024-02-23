import 'dotenv/config';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { Schema, model, connect, ObjectId } from 'mongoose';
import Category from './models/category';
import categoryRoutes from './controllers/category';
import Transaction from './models/transaction';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(categoryRoutes.routes());
app.use(categoryRoutes.allowedMethods());

router.get('/', async (ctx) => {
  await connect(process.env.MONGODB_CONNSTRING as string);
  ctx.body = 'hello world'
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(3003, () => {
  console.log('Server running on http://localhost:3000');
});


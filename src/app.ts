import 'dotenv/config';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import categoryRoutes from './api/controllers/category-controller/category';
import { initDB } from './connect';
import { config } from './config';

const app = new Koa();
const router = new Router();
(async () => {
  await initDB(config);
  app.use(bodyParser());
  app.use(categoryRoutes.routes());
  app.use(categoryRoutes.allowedMethods());

  router.get('/', async (ctx) => {
    ctx.body = 'hello world'
  });

  app.use(router.routes()).use(router.allowedMethods());


  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
})()


import { Context } from 'koa';
import Router from 'koa-router';
import { validateId } from '../../../middleware/validation';


const createAccount = async (ctx: Context) => {
  console.log('create');
}

const getAccounts = async (ctx: Context) => {

}

const getAccountById = async (ctx: Context) => {

}

const updateAccount = async (ctx: Context) => {

}

const deleteAccount = async (ctx: Context) => {

}

const router = new Router();

router.post('/accounts', createAccount);
router.get('/accounts', getAccounts);
router.get('/accounts/:id', validateId, getAccountById);
router.delete('/accounts/:id', validateId, deleteAccount);
router.put('/accounts/:id', validateId, updateAccount);

export default router;



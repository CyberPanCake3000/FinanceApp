import Joi from 'joi';
import { TransactionType } from '../../../models/transaction';

export const createTransactionSchema = Joi.object({
  accountId: Joi.string().required(),
  categoryId: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid(...Object.values(TransactionType)).required(),
  date: Joi.date().required(),
  description: Joi.string().allow('').optional(),
});

export const updateTransactionSchema = Joi.object({
  accountId: Joi.string().optional(),
  categoryId: Joi.string().optional(),
  amount: Joi.number().optional(),
  type: Joi.string().valid(...Object.values(TransactionType)).optional(),
  date: Joi.date().optional(),
  description: Joi.string().allow('').optional(),
}).min(1);

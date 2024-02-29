import Joi from 'joi';
import { AccountType } from '../../../models/account';

const accountFieldsValidation = {
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  balance: Joi.number().required(),
  currency: Joi.string().required(),
  type: Joi.string().valid(...Object.values(AccountType)).required(),
};

const createAccountSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  ...accountFieldsValidation,
});

const updateAccountSchema = Joi.object({
  title: accountFieldsValidation.title.optional(),
  description: accountFieldsValidation.description,
  balance: accountFieldsValidation.balance.optional(),
  currency: accountFieldsValidation.currency.optional(),
  type: accountFieldsValidation.type.optional(),
  deletedAt: Joi.date(),
}).min(1);

export { createAccountSchema, updateAccountSchema };

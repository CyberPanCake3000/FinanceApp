import { Context, Next } from 'koa';
import Joi from 'joi';
import { currencies } from '../utils/constans/currencies';
import { ObjectId } from 'mongoose';

const idSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, 'MongoDB ObjectID');

export const validateId = async (ctx: Context, next: Next) => {
  const { id } = ctx.params as { id: ObjectId }
  const { error } = idSchema.validate(id);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
    return;
  }
  await next();
};

export const validateCurrency = async (ctx: Context, next: Next) => {
  const { currency } = ctx.request.body as { currency?: string }

  if (currency !== undefined) {
    if (!Object.hasOwnProperty.call(currencies, currency)) {
      ctx.status = 400;
      ctx.body = { error: "Invalid currency format" };
      return;
    }
  }

  await next();
}

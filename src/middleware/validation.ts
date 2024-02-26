import { Context, Next } from 'koa';
import Joi from 'joi';

const idSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, 'MongoDB ObjectID');

export const validateId = async (ctx: Context, next: Next) => {
  const { error } = idSchema.validate(ctx.params.id);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
    return;
  }
  await next();
};

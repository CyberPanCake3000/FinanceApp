import Joi from 'joi';

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  icon: Joi.string().allow(''),
  description: Joi.string().allow(''),
  position: Joi.number(),
  color: Joi.string().allow(''),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().allow(''),
  description: Joi.string().allow(''),
  position: Joi.number(),
  color: Joi.string().allow(''),
});
import 'dotenv/config';
import Router from 'koa-router';
import { Context } from 'koa';
import Category from '../models/category';
import Joi from 'joi';


const categorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().allow(''),
  description: Joi.string().allow(''), // Allow empty string
  position: Joi.number(),
  color: Joi.string(),
});

const idSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, 'MongoDB ObjectID');

const createCategory = async (ctx: Context) => {
  try {
    const { value, error } = categorySchema.validate(ctx.request.body);
    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const category = new Category(value);
    await category.save();
    ctx.status = 201;
    ctx.body = category;

  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const getCategories = async (ctx: Context) => {
  try {
    const categories = await Category.find({});
    ctx.body = categories;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const getCategoryById = async (ctx: Context) => {
  const { error } = idSchema.validate(ctx.params.id);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
    return;
  }

  try {
    const category = await Category.findById(ctx.params.id);
    if (!category) {
      ctx.throw(404, 'Category not found');
    }
    ctx.body = category;
  } catch (error) {
    ctx.body = error;
  }
};

const updateCategory = async (ctx: Context) => {
  try {
    const { value, error } = categorySchema.validate(ctx.request.body);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: "Invalid category format" };
      return;
    }

    const category = await Category.findByIdAndUpdate(
      ctx.params.id,
      value,
      { new: true }
    );
    if (!category) {
      ctx.throw(404, 'Category not found');
    }
    ctx.body = category;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const deleteCategory = async (ctx: Context) => {
  const { error } = idSchema.validate(ctx.params.id);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
    return;
  }

  try {
    const category = await Category.findByIdAndDelete(ctx.params.id); // TODO: validation
    if (!category) {
      ctx.throw(404, 'Category not found');
    }
    ctx.status = 200;
    ctx.body = 'Category deleted';
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};

const router = new Router();

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;

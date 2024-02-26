import 'dotenv/config';
import Router from 'koa-router';
import { Context } from 'koa';
import Category, { ICategory } from '../models/category';
import Joi from 'joi';
import { validateId } from '../middleware/validation';

interface UpdateCategoryRequest {
  name?: string,
  icon?: string,
  description?: string,
  position?: number,
  color?: string,
}

const categorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().allow(''),
  description: Joi.string().allow(''), // Allow empty string
  position: Joi.number(),
  color: Joi.string().allow(''),
});

const createCategory = async (ctx: Context) => {
  const { value, error } = categorySchema.validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
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

    const category = await Category.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body as UpdateCategoryRequest,
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
  try {
    const category = await Category.findByIdAndDelete(ctx.params.id);
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
router.get('/categories/:id', validateId, getCategoryById);
router.delete('/categories/:id', validateId, deleteCategory);
router.put('/categories/:id', validateId, updateCategory);

export default router;

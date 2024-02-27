import Router from 'koa-router';
import { Context } from 'koa';
import Category from '../../../models/category';
import { validateId } from '../../../middleware/validation';
import { createCategorySchema, updateCategorySchema } from './category-schemas';

interface UpdateCategoryRequest {
  name?: string,
  icon?: string,
  description?: string,
  position?: number,
  color?: string,
}

const createCategory = async (ctx: Context) => {
  const { value, error } = createCategorySchema.validate(ctx.request.body);
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
  const { value, error } = updateCategorySchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  try {
    const category = await Category.findByIdAndUpdate(
      ctx.params.id,
      value as UpdateCategoryRequest,
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

const categoryRoutes = new Router();

categoryRoutes.post('/category', createCategory);
categoryRoutes.get('/categories', getCategories);
categoryRoutes.get('/category/:id', validateId, getCategoryById);
categoryRoutes.delete('/category/:id', validateId, deleteCategory);
categoryRoutes.put('/category/:id', validateId, updateCategory);

export default categoryRoutes;

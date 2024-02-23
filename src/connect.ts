import 'dotenv/config';
import { Schema, model, connect, ObjectId } from 'mongoose';
import { AppConfig } from './config';

export let conn:any;

export const initDB = async (config: AppConfig) => {
  conn = await connect(config.mongoConnectString);
}

import 'dotenv/config';
import joi from 'joi';
import * as process from 'process';

const configSchema = joi.object({
  mongoConnectString: joi.string().required(),
  port: joi.number().required(),
});

const envConfiguration = {
  mongoConnectString: process.env.DB_CONNSTRING,
  port: process.env.APP_PORT,
};

export interface AppConfig {
  mongoConnectString: string,
  port: number,
}

const { value, error } = configSchema.validate(envConfiguration, { convert: true, abortEarly: true });
if (error) {
  throw new Error(`Config validation failed: ${error.message}.`);
}
const config: AppConfig = value;

export { config };

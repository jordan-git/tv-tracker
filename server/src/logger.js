import winston from 'winston';
import dotenv from 'dotenv-safe';
import path from 'path';
import { logsFolderPath } from './utils.js';

dotenv.config();

// TODO: Make helper function to create logger for each service
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logsFolderPath, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logsFolderPath, 'main.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;

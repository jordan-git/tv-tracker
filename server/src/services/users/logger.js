import { logsFolderPath } from '../../utils.js';
import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

const transports = [
  new winston.transports.File({ filename: path.join(logsFolderPath, 'error.log'), level: 'error' }),
  new winston.transports.File({ filename: path.join(logsFolderPath, 'main.log') }),
  new winston.transports.File({ filename: path.join(logsFolderPath, '/user/combined.log') }),
  new winston.transports.File({ filename: path.join(logsFolderPath, '/user/error.log'), level: 'error' })
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf((info) => `[User Service] ${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = expressWinston.logger({
  transports,
  format,
  meta: false,
  expressFormat: true,
  ignoreRoute: function (req, res) { return false; }
});

export default logger;

import { addAsync } from '@phoenix35/express-async-methods';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import express from 'express';
import expressWinston from 'express-winston';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import router from './routes.js';

dotenv.config();

// default commonJS variable created manually for ES
const __dirname = dirname(fileURLToPath(import.meta.url));

// TODO: Set up linting for code quality
const app = addAsync(express());

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/images',express.static(join(__dirname, '../images')));

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ error: 'Bad Request' });
  }
  next();
});

const timeout = 10000;

app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${process.env.USER_PORT}/`,
  pathRewrite: { '^/api/users': '' },
  onProxyReq: fixRequestBody,
  timeout
}));

app.use('/api/profiles', createProxyMiddleware({
  target: `http://localhost:${process.env.PROFILE_PORT}/`,
  pathRewrite: { '^/api/profiles': '' },
  onProxyReq: fixRequestBody,
  timeout
}));

app.use('/api', router);

app.use('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

export default app;

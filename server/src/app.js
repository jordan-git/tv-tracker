import { addAsync } from '@phoenix35/express-async-methods';
import cookieParser from 'cookie-parser';
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

// TODO: Set up logging for app to ease debugging
// TODO: Set up linting for code quality
const app = addAsync(express());

app.use(cookieParser());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ error: 'Bad Request' });
  }
});

const timeout = 10000;

app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${process.env.USER_PORT}/`,
  pathRewrite: { '^/api/users': '' },
  onProxyReq: fixRequestBody,
  timeout,
}));

app.use('/api/profiles', createProxyMiddleware({
  target: `http://localhost:${process.env.PROFILE_PORT}/`,
  pathRewrite: { '^/api/profiles': '' },
  onProxyReq: fixRequestBody,
  timeout,
}));

app.use('/api', router);

export default app;
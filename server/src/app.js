import express from 'express';
import { addAsync } from '@phoenix35/express-async-methods';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import dotenv from 'dotenv-safe';

import router from './routes.js'

dotenv.config();

// default commonJS variable created manually for ES
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = addAsync(express());

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const timeout = 10000;

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ error: 'Bad Request' });
  }
});

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
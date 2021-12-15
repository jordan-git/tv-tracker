import express from 'express';
import { addAsync } from '@phoenix35/express-async-methods';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import dotenv from 'dotenv-safe';

dotenv.config();

// default commonJS variable created manually for ES
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = addAsync(express());

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${process.env.USERS_PORT}/`,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
  onProxyReq: fixRequestBody,
  timeout: 10000,
}));

export default app;
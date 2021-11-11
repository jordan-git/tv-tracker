import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import proxy from 'http-proxy';

// default commonJS variable created manually for ES
const __dirname = dirname(fileURLToPath(import.meta.url));

const usersProxy = proxy.createProxyServer({ target: 'http://localhost:4001/' })

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  usersProxy.web(req, res)
})

export default app;
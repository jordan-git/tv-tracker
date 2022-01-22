import dotenv from 'dotenv-safe';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

dotenv.config();

import app from './app.js';

const port = Number(process.env.SERVER_PORT);

// default commonJS variable created manually for ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadOrder = [
  'users',
  'profiles',
];

for (const service of loadOrder) {
  try {
    await import(pathToFileURL(path.join(__dirname, `services/${service}/service.js`)));
  } catch (err) {
    console.error(`Error starting service ${service}`, err);
  }
}

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`)
});
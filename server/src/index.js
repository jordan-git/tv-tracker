import fsP from 'fs/promises';
import dotenv from 'dotenv-safe';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

// load environment variables
dotenv.config();

import app from './app.js';

const port = Number(process.env.SERVER_PORT);

// default commonJS variable created manually for ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// start microservices
// const directories = (await (fsP.readdir(path.join(__dirname, 'services'), { withFileTypes: true })))
//   .filter((dir) => dir.isDirectory())
//   .map(({ name }) => name);

const loadOrder = [
  'users',
  'profiles',
];

for (const service of loadOrder) {
  try {
    await import(pathToFileURL(path.join(__dirname, `services/${service}/service.js`)));
  } catch (err) {
    console.log(`Error starting service ${service}`);
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`)
});
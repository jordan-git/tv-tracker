import fsP from 'fs/promises';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

import app from './app.js';

const port = Number(process.env.SERVER_PORT) || 4000;

// default commonJS variable created manually for ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// start services
const directories = (await (fsP.readdir(path.join(__dirname, 'services'), { withFileTypes: true })))
  .filter((dir) => dir.isDirectory())
  .map(({ name }) => name);

for (const directory of directories) {
  try {
    await import(pathToFileURL(path.join(__dirname, `services/${directory}/app.js`)));
  } catch (err) {
    console.log(`Error starting service ${directory}`);
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
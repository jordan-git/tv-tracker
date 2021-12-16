import express from 'express';
import { addAsync } from '@phoenix35/express-async-methods';

import router from './routes.js';

const app = addAsync(express());

app.use(express.json());

app.use(router);

app.listen(parseInt(process.env.USER_PORT), () => {
  console.log(`User service listening on port ${process.env.USER_PORT}`);
});

export default app;
import express from 'express';
import { addAsync } from '@phoenix35/express-async-methods';
import logger from './logger.js';
import router from './routes.js';

const app = addAsync(express());

app.use(express.json());

app.use(logger);

app.use(router);

app.listen(parseInt(process.env.PROFILE_PORT), () => {
  console.log(`Profile service listening on port ${process.env.PROFILE_PORT}`);
});

export default app;

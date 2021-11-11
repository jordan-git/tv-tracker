import express from 'express';

const app = express();

app.use(express.json());

app.use('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(4001);

export default app;
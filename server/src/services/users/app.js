import express from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { addAsync } from '@phoenix35/express-async-methods';
import knex from './database.js'
import util from 'util';
import { verifyJWT } from './middleware.js';

const signToken = util.promisify(jsonwebtoken.sign);

const app = addAsync(express());

app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  const user = await knex('users').select("*").where({ email }).first();

  if (!user) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = await signToken({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({ token });
});

app.getAsync('/verify', verifyJWT, (req, res) => {
  res.json({ verified: true });
});

app.listen(parseInt(process.env.USERS_PORT), () => {
  console.log(`User service listening on port ${process.env.USERS_PORT}`);
});

export default app;
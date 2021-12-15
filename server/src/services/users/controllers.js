import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import util from 'util';

import knex from './database.js'

const signToken = util.promisify(jsonwebtoken.sign);

export async function login(req, res) {
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
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing name, email or password' });
    return;
  }

  const user = await knex('users').select("*").where({ email }).first();

  if (user) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const [id] = await knex('users').insert({ name, email, password: hash });

  const token = await signToken({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({ token });
}
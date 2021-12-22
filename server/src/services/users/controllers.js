import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import util from 'util';

import knex from './db.js'

const signToken = util.promisify(jsonwebtoken.sign);

export async function verifyCredentials(req, res) {
  const { email, password } = req.body;

  const user = await knex('users').select("*").where({ email }).first();

  if (!user) {
    res.status(401).json({ error: 'Invalid email/password combination' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    res.status(401).json({ error: 'Invalid email/password combination' });
  }

  const token = await signToken({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({ token });
}

export async function getUsers(req, res) {
  const users = await knex('users').select("*");

  res.json(users);
}

export async function getUser(req, res) {
  const { id } = req.params;

  const user = await knex('users').select("*").where({ id }).first();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
}

export async function createUser(req, res) {
  const { username, email, password } = req.body;

  const emailExists = await knex('users').select("*").where({ email }).first();

  if (emailExists) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const usernameExists = await knex('users').select("*").where({ username }).first();

  if (usernameExists) {
    res.status(409).json({ error: 'Username already in use' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const [id] = await knex('users').insert({ username, email, password: hash });

  res.json({ id });
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const user = await knex('users').select("*").where({ id }).first();

  if (!user) {
    res.status(400).json({ error: 'User not found' });
    return;
  }

  const emailExists = await knex('users').select("*").where({ email }).first();

  if (emailExists && email !== user.email) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const usernameExists = await knex('users').select("*").where({ username }).first();

  if (usernameExists && username !== user.username) {
    res.status(409).json({ error: 'Username already in use' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await knex('users').update({ username, email, password: hash }).where({ id });

  res.json({ id });
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  const user = await knex('users').select("*").where({ id }).first();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  await knex('profiles').where({ user_id: id }).del();

  await knex('users').where({ id }).del();

  res.json({ id });
} 
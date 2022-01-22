import bcrypt from 'bcrypt';
import knex from './db.js';
import { sendJsonRequest, signToken } from '../../utils.js';

export async function login (req, res) {
  const { email, password } = req.body;

  // Check for email
  const user = await knex('users').select('*').where({ email }).first();
  if (!user) {
    res.status(401).json({ error: 'Invalid email/password combination' });
    return;
  }

  // Check if passwords match
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid email/password combination' });
  }

  // TODO: Make function for JWT signing
  // Sign JWT token
  const jwt = await signToken({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5s' });

  const { refresh } = await sendJsonRequest(`/users/${user.id}/token`, 'POST');

  res.send({ jwt, refresh });
}

// TODO: Use API for database communication
export async function getUsers (req, res) {
  const users = await knex('users').select('*');
  res.json(users);
}

export async function getUser (req, res) {
  const { id } = req.params;

  const user = await knex('users').select('*').where({ id }).first();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
}

export async function createUser (req, res) {
  const { username, email, password } = req.body;

  const emailExists = await knex('users').select('*').where({ email }).first();

  if (emailExists) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const usernameExists = await knex('users').select('*').where({ username }).first();

  if (usernameExists) {
    res.status(409).json({ error: 'Username already in use' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const [id] = await knex('users').insert({ username, email, password: hash });

  res.json({ id });
}

export async function updateUser (req, res) {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const user = await knex('users').select('*').where({ id }).first();

  if (!user) {
    res.status(400).json({ error: 'User not found' });
    return;
  }

  const emailExists = await knex('users').select('*').where({ email }).first();

  if (emailExists && email !== user.email) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const usernameExists = await knex('users').select('*').where({ username }).first();

  if (usernameExists && username !== user.username) {
    res.status(409).json({ error: 'Username already in use' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await knex('users').update({ username, email, password: hash }).where({ id });

  res.json({ id });
}

export async function deleteUser (req, res) {
  const { id } = req.params;

  const user = await knex('users').select('*').where({ id }).first();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  await knex('profiles').where({ user_id: id }).del();

  await knex('users').where({ id }).del();

  res.json({ id });
}

// Middleware
export async function getRefreshToken (req, res) {
  const { id } = req.params;

  const { token } = await knex('tokens').select('*').where({ user_id: id }).first();

  if (!token) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }

  res.json({ token: token });
}

function generateRefreshToken () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}

export async function createRefreshToken (req, res) {
  const { id: user_id } = req.params;

  // Create refresh token
  const existingRefreshToken = await knex('tokens').select('*').where({ user_id }).first();

  if (existingRefreshToken) {
    await knex('tokens').where({ user_id }).del();
  }

  const refreshToken = generateRefreshToken();

  const TwoDaysFromNow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);
  const [expires] = TwoDaysFromNow.toISOString().split('T');

  await knex('tokens').insert({
    token: refreshToken,
    expires,
    user_id
  });

  return res.json({ refresh: refreshToken });
}

export async function deleteRefreshToken (req, res) {
  const { id: user_id } = req.params;

  const tokenData = await knex('tokens').select('*').where({ user_id }).first();

  if (!tokenData) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }

  await knex('tokens').where({ user_id }).del();

  res.json({ id: tokenData.id });
}

export async function readJwt (req, res) {
  res.json({ user: req.user });
}

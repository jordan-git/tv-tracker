import knex from './db.js';
import { sendRequest } from '../../util.js';

// TODO: Add error handling

export async function getProfiles(req, res) {
  const profiles = await knex('profiles').select('*');

  res.json(profiles);
}

export async function getProfile(req, res) {
  const { id } = req.params;

  const profile = await knex('profiles').select('*').where({ id }).first();

  if (!profile) {
    res.status(400).json({ error: 'Profile not found' });
    return;
  }

  res.json(profile);
}

export async function createProfile(req, res) {
  const { user_id } = req.body;

  const user = await sendRequest(`users/${user_id}`, 'GET');

  if (user.error) {
    res.status(400).json({ error: user.error });
    return;
  }

  const profile = await knex('profiles').select('*').where({ user_id }).first();

  if (profile) {
    res.status(409).json({ error: 'User already has a profile' });
    return;
  }

  const [id] = await knex('profiles').insert(req.body);

  res.json({ id });
}

export async function updateProfile(req, res) {
  const { id } = req.params;

  const profile = await knex('profiles').select('*').where({ id }).first();

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  await knex('profiles').update(req.body).where({ id });

  res.json({ id });
}

export async function deleteProfile(req, res) {
  const { id } = req.params;

  const profile = await knex('profiles').select('*').where({ id }).first();

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  await knex('profiles').where({ id }).del();

  res.json({ id });
}
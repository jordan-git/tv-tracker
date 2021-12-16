import knex from './db.js';

export async function getProfiles(req, res) {
  const profiles = await knex('profiles').select('*');
  res.json(profiles);
}

export async function createProfile(req, res) {
  const { gender, birthday, user_id } = req.body;

  const [id] = await knex('profiles').insert(req.body);

  res.json({ id });
}
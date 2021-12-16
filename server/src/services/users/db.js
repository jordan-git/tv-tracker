import knex from '../../connection.js';
import bycrypt from 'bcrypt';

const userTableExists = await knex.schema.hasTable('users');

if (!userTableExists) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('email').unique();
    table.string('password');
  });
}

const users = [
  { username: 'John Doe', email: 'test1@mail.com', password: 'password' },
  { username: 'Jane Doe', email: 'test2@mail.com', password: 'password' }
];

async function encryptPassword(user) {
  const hash = await bycrypt.hash(user.password, 10);
  user.password = hash;
  return user;
}

const encryptedUsers = await Promise.all(users.map(encryptPassword));

await knex('users').insert(encryptedUsers);

export default knex;
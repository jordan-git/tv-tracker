import knex from '../../connection.js';
import bycrypt from 'bcrypt';

// TODO: Consider separate knex objects for each table and solely rely on requests for cross-service communication
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
  { username: 'John Doe', email: 'test1@mail.com', password: 'Password1' },
  { username: '1', email: '1', password: '1' }
];

async function encryptPassword(user) {
  const hash = await bycrypt.hash(user.password, 10);
  user.password = hash;
  return user;
}

const encryptedUsers = await Promise.all(users.map(encryptPassword));

await knex('users').insert(encryptedUsers);

const tokenTableExists = await knex.schema.hasTable('tokens');

if (!tokenTableExists) {
  await knex.schema.createTable('tokens', (table) => {
    table.increments('id').primary();
    table.string('token').unique();
    table.dateTime('expires').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users');;
  });
}

export default knex;
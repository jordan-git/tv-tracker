import knexFn from 'knex';
import bycrypt from 'bcrypt';

const knex = knexFn({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password'
  }
});

await knex.raw("DROP DATABASE IF EXISTS tv_tracker");
await knex.raw("CREATE DATABASE IF NOT EXISTS tv_tracker");
await knex.raw("USE tv_tracker");

const userTableExists = await knex.schema.hasTable('users');

if (!userTableExists) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('password');
  });
}

const users = [
  { name: 'John Doe', email: 'test1@mail.com', password: 'password' },
  { name: 'Jane Doe', email: 'test2@mail.com', password: 'password' }
];

async function encryptPassword(user) {
  const hash = await bycrypt.hash(user.password, 10);
  user.password = hash;
  return user;
}

const encryptedUsers = await Promise.all(users.map(encryptPassword));

await knex('users').insert(encryptedUsers);

export default knex;
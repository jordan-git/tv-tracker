import knexFn from 'knex';

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

export default knex;
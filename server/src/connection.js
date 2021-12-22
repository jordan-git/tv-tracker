import knexFn from 'knex';
import dotenv from 'dotenv-safe';

dotenv.config();

const knex = knexFn({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
});

await knex.raw("DROP DATABASE IF EXISTS tv_tracker");
await knex.raw("CREATE DATABASE IF NOT EXISTS tv_tracker");
await knex.raw("USE tv_tracker");

export default knex;
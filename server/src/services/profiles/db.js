import knex from '../../connection.js';

const profileTableExists = await knex.schema.hasTable('profiles');

if (!profileTableExists) {
  // Create a profile table with foreign key to user table
  const ISODateString = new Date().toISOString().split("T")[0];

  await knex.schema.createTable('profiles', (table) => {
    table.increments('id').primary();
    table.enum('gender', ['male', 'female', 'other', 'unknown']).defaultTo('unknown');
    table.date('birthday');
    table.date('created').defaultTo(ISODateString);
    table.integer('user_id').unsigned().references('id').inTable('users');
  });
}

const profiles = [
  { gender: 'male', birthday: 'test1@mail.com', created: '2021-12-13', birthday: '1993-12-02', user_id: 1 },
  { gender: 'female', birthday: 'test2@mail.com', created: '2021-12-13', birthday: '1996-04-07', user_id: 2 }
];

await knex('profiles').insert(profiles);

export default knex;
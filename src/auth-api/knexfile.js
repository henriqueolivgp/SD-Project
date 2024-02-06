module.exports = {
  db: {
      client: 'pg', // Specify the database engine (PostgreSQL)
      connection: {
          host: 'localhost',
          user: 'sd',
          password: 'sd',
          database: 'sd'
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations'
    },
    seeds: {
        directory: './seeds',
    },
  },
};

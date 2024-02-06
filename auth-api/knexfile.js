module.exports = {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'sd',
            port: '15432',
            password: 'sd',
            database: 'sd'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations'
        }
};
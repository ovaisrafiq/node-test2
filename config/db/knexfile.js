const knexConfig = {
    "localhost": {
        client: 'mysql',
        debug: false,
        connection: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'node_test',
            port:3306
        },
        migrations: {
            directory: __dirname + '/migrations'
        },
        seeds: {
            directory: __dirname + '/seeds'
        }
    }
};
// override the database connection string
if (process.env.DATABASE_URL && process.env.NODE_ENV && {}.hasOwnProperty.call(knexConfig, process.env.NODE_ENV)) {
    knexConfig[process.env.NODE_ENV].connection = process.env.DATABASE_URL;
}

module.exports = knexConfig;

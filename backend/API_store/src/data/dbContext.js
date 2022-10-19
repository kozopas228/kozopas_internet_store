const config = require('../config');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const DB_NAME = config.dbName;
const DB_USER = config.dbUser;
const DB_PASSWORD = config.dbPassword;
const DB_HOST = config.dbHost;
const DB_PORT = config.dbPort;

const dbContext = {
    async getConnection() {
        const connection = mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD
        }).promise();

        await connection.query(`create schema if not exists kozopas_internet_store_store;`);

        await connection.query(`use kozopas_internet_store_store;`);

        return connection;
    },

    async dropAllTables() {
        const connection = await this.getConnection();
        const tablesSqlResult = await connection.query('show tables');
        const tables = tablesSqlResult[0].map(x => x.Tables_in_kozopas_internet_store_store);
        if (!tables.length) {
            return;
        }

        let sql = 'drop table ';
        for (const table of tables) {
            sql += table + ', ';
        }
        sql = sql.slice(0, sql.length - 2) + ';';
        await connection.query(sql);
        await connection.end();
    },

    async applyMigrations() {
        const connection = await this.getConnection();

        const migrations = [];

        let normalizedPath = path.join(__dirname, "migrations");
        fs.readdirSync(normalizedPath)
            .filter(file => file != 'BaseMigration.js')
            .sort((x, y) => {
                const first = x.split('_')[1].split('.')[0];
                const second = y.split('_')[1].split('.')[0];
                return first - second;
            })
            .forEach((file) => {
                const migration = require('./migrations/' + file);
                migrations.push(new migration(connection));
            });

        for (const migration of migrations) {
            await migration.apply();
        }

        await connection.end();
    }
};


module.exports = dbContext;

const config = require('../config');
const mysql = require('mysql2');
const MigrationCreateAll = require("./migrations/MigrationCreateAll");
const MigrationInitializeData = require("./migrations/MigrationInitializeData");

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

        try {
            await connection.query(`create schema if not exists kozopas_internet_store_authorization;`);

            await connection.query(`use kozopas_internet_store_authorization;`);

            return connection;
        } catch (e) {
            let a = e;
        }
    },

    async dropAllTables() {
        const connection = await this.getConnection();
        const tablesSqlResult = await connection.query('show tables');
        const tables = tablesSqlResult[0].map(x => x.Tables_in_kozopas_internet_store_authorization);
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

        const migrations = [
            new MigrationCreateAll(connection),
            new MigrationInitializeData(connection),
        ];

        for (const migration of migrations) {
            await migration.apply();
        }

        await connection.end();
    }
};



module.exports = dbContext;

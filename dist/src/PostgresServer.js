"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresServer = void 0;
const pg = require("pg");
const JSColumn_1 = require("./JSColumn");
const JSDataSet_1 = require("./JSDataSet");
const JSTable_1 = require("./JSTable");
const DatabaseManager_1 = require("./DatabaseManager");
const application_1 = require("./application");
class PostgresServer {
    constructor(databaseManagerInstance, settings) {
        this.databaseManagerInstance = databaseManagerInstance;
        this.settings = settings;
        this.tables = new Map();
        this.pg_types = {
            16: JSColumn_1.JSColumn.NUMBER,
            19: JSColumn_1.JSColumn.TEXT,
            20: JSColumn_1.JSColumn.NUMBER,
            21: JSColumn_1.JSColumn.NUMBER,
            23: JSColumn_1.JSColumn.NUMBER,
            25: JSColumn_1.JSColumn.TEXT,
            705: JSColumn_1.JSColumn.TEXT,
            1082: JSColumn_1.JSColumn.DATETIME,
            1114: JSColumn_1.JSColumn.DATETIME,
            1184: JSColumn_1.JSColumn.DATETIME,
            1043: JSColumn_1.JSColumn.TEXT,
            1700: JSColumn_1.JSColumn.NUMBER,
        };
        this.openConnections = [];
        this.availableConnections = [];
    }
    getOpenConnectionCount() {
        return this.openConnections.length;
    }
    getAvailableConnectionCount() {
        return this.availableConnections.length;
    }
    connectToDatabase() {
        let client = this.availableConnections.pop();
        if (client) {
            return Promise.resolve(client);
        }
        if (this.openConnections.length < this.settings.poolSize) {
            return new Promise((resolve, reject) => {
                client = new pg.Client(this.settings.connectionString);
                this.openConnections.push(client);
                client.connect((err) => {
                    if (err) {
                        this.openConnections = this.openConnections.filter((c) => c !== client);
                        reject(err);
                        return;
                    }
                    resolve(client);
                });
            });
        }
        return new Promise(async (resolve) => {
            let done = false;
            while (!done) {
                const availableClient = this.availableConnections.pop();
                if (availableClient) {
                    done = true;
                    resolve(availableClient);
                    return;
                }
                await (0, application_1.sleep)(10);
            }
        });
    }
    closeAllConnections() {
        this.openConnections.map((connection) => {
            connection.end();
        });
        this.availableConnections.map((connection) => {
            connection.end();
        });
        this.availableConnections = [];
        this.openConnections = [];
    }
    async getDatabaseProductName(callback) {
        return this.databaseManagerInstance.getDataSetByQuery('postgres', 'select version()', [], 1, (err, result) => {
            callback(err, result.getValue(1, 1));
        });
    }
    async getTables() {
        throw new Error('Not implemented');
    }
    sql(query, args) {
        while (query.indexOf('?') > -1) {
            let arg = args.shift();
            if (typeof arg === 'string') {
                arg = `'${arg}'`;
            }
            query = query.replace('?', arg);
        }
        return query;
    }
    async getClient() {
        return {
            getDataSetByQuery: async (sqlQuery, args, maxReturnedRows) => {
                const client = await this.connectToDatabase();
                return new Promise((resolve, reject) => {
                    client.query(this.sql(sqlQuery, args), [], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        this.availableConnections.push(client);
                        const dataset = new JSDataSet_1.JSDataSet();
                        result.fields.forEach((field, index) => {
                            dataset.addColumn(field.name, index + 1, this.convertToJSColumn(field.dataTypeID, field.name));
                        });
                        result.rows.forEach((record) => {
                            if (dataset.getMaxRowIndex() < maxReturnedRows ||
                                maxReturnedRows === -1) {
                                dataset.addRow(result.fields.map((field) => record[field.name]));
                            }
                        });
                        return resolve(dataset);
                    });
                });
            },
        };
    }
    convertToJSColumn(pgType, name) {
        if (this.pg_types[pgType] === undefined) {
            throw new Error(`Unknown dataTypeID: ${pgType.toString()} (${name})`);
        }
        return this.pg_types[pgType];
    }
    async getTable(serverName, tableName) {
        const table = new JSTable_1.JSTable({
            databaseManager: new DatabaseManager_1.DatabaseManager(),
            serverName,
            tableName,
            server: this,
        });
        await table.initialize();
        return table;
    }
}
exports.PostgresServer = PostgresServer;
//# sourceMappingURL=PostgresServer.js.map
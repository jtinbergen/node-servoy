import * as pg from 'pg';
import { JSColumn } from './JSColumn';
import { JSDataSet } from './JSDataSet';
import { JSTable } from './JSTable';
import { DatabaseManager } from './DatabaseManager';
import { DatabaseManagerInstance } from './DatabaseManagerInstance';
import { sleep } from './application';

export class PostgresServer {
    settings: any;
    tables: Map<string, JSTable>;
    pg_types: { [key: number]: JSColumn };
    openConnections: pg.Client[];
    availableConnections: pg.Client[];
    databaseManagerInstance: DatabaseManagerInstance;

    constructor(databaseManagerInstance: DatabaseManagerInstance, settings: any) {
        this.databaseManagerInstance = databaseManagerInstance;
        this.settings = settings;
        this.tables = new Map();
        this.pg_types = {
            16: JSColumn.NUMBER,
            19: JSColumn.TEXT,
            20: JSColumn.NUMBER,
            21: JSColumn.NUMBER,
            23: JSColumn.NUMBER,
            25: JSColumn.TEXT,
            705: JSColumn.TEXT,
            1082: JSColumn.DATETIME,
            1114: JSColumn.DATETIME,
            1184: JSColumn.DATETIME,
            1043: JSColumn.TEXT,
            1700: JSColumn.NUMBER,
        };
        this.openConnections = [];
        this.availableConnections = [];
    }

    public getOpenConnectionCount() {
        return this.openConnections.length;
    }

    public getAvailableConnectionCount() {
        return this.availableConnections.length;
    }

    public connectToDatabase(): Promise<pg.Client> {
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

                    resolve(client as pg.Client);
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
                await sleep(10);
            }
        });
    }

    public closeAllConnections() {
        this.openConnections.map((connection) => {
            connection.end();
        });
        this.availableConnections.map((connection) => {
            connection.end();
        });

        this.availableConnections = [];
        this.openConnections = [];
    }

    public async getDatabaseProductName(callback: Function) {
        return this.databaseManagerInstance.getDataSetByQuery(
            'postgres',
            'select version()',
            [],
            1,
            (err: Error, result: JSDataSet) => {
                callback(err, result.getValue(1, 1));
            },
        );
    }

    public async getTables() {
        throw new Error('Not implemented');
    }

    public sql(query: string, args: any) {
        while (query.indexOf('?') > -1) {
            let arg = args.shift();
            if (typeof arg === 'string') {
                arg = `'${arg}'`;
            }

            query = query.replace('?', arg);
        }

        return query;
    }

    public async getClient() {
        return {
            getDataSetByQuery: async (
                sqlQuery: string,
                args: any[],
                maxReturnedRows: number,
            ): Promise<JSDataSet> => {
                const client = await this.connectToDatabase();
                return new Promise((resolve, reject) => {
                    client.query(
                        this.sql(sqlQuery, args),
                        [],
                        (err: Error, result: pg.QueryResult) => {
                            if (err) {
                                return reject(err);
                            }

                            this.availableConnections.push(client);
                            const dataset = new JSDataSet();
                            result.fields.forEach((field: any, index: number) => {
                                dataset.addColumn(
                                    field.name,
                                    index + 1,
                                    this.convertToJSColumn(field.dataTypeID, field.name),
                                );
                            });

                            result.rows.forEach((record) => {
                                if (
                                    dataset.getMaxRowIndex() < maxReturnedRows ||
                                    maxReturnedRows === -1
                                ) {
                                    dataset.addRow(
                                        result.fields.map((field) => record[field.name]),
                                    );
                                }
                            });

                            return resolve(dataset);
                        },
                    );
                });
            },
        };
    }

    public convertToJSColumn(pgType: JSColumn, name: string) {
        if (this.pg_types[pgType] === undefined) {
            throw new Error(`Unknown dataTypeID: ${pgType.toString()} (${name})`);
        }

        return this.pg_types[pgType];
    }

    public async getTable(serverName: string, tableName: string) {
        const table = new JSTable({
            databaseManager: new DatabaseManager(),
            serverName,
            tableName,
            server: this,
        });

        await table.initialize();
        return table;
    }
}

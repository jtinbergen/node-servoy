const pg = require('pg');
const JSColumn = require('./JSColumn');
const JSDataSet = require('./JSDataSet');
const JSTable = require('./JSTable');

class PostgresServer {
  constructor(settings) {
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
            this.openConnections = this.openConnections.filter(
              (c) => c !== client,
            );
            reject(err);
            return;
          }

          resolve(client);
        });
      });
    }

    function sleep(timeout) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, timeout);
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

  getDatabaseProductName(serverName, callback) {
    this.getDataSetByQuery(
      'postgres',
      'select version()',
      [],
      1,
      (err, result) => {
        callback(err, result.getValue(1, 1));
      },
    );
  }

  getTables() {
    // const tableNames = await this.getTableNames(databaseName);
    // for (let index = 0; index < tableNames.length; index += 1) {
    //     const table = await this.getTable(databaseName, tableNames[index]);
    //     this.tables.set(tableNames[index], table);
    // }
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
            const dataset = new JSDataSet();
            result.fields.forEach((field, index) => {
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
    const table = new JSTable({
      serverName,
      tableName,
      server: this,
    });
    await table.initialize();
    return table;
  }
}

module.exports = PostgresServer;

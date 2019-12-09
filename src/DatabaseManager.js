const DatabaseManagerInstance = require('./DatabaseManagerInstance');
const PostgresServer = require('./PostgresServer');

class DatabaseManager {
  constructor() {
    this.servers = new Map();
  }

  registerServer(server) {
    if (!server.name) {
      throw new Error('name property is required.');
    }

    if (!server.connectionString) {
      throw new Error('connectionString property is required.');
    }

    this.servers.set(
      server.name,
      new PostgresServer(
        Object.assign(
          {},
          {
            poolSize: 1,
            standbySize: 1,
          },
          server,
        ),
      ),
    );
  }

  unregisterServer(serverName) {
    if (!serverName) {
      throw new Error('name property is required.');
    }

    this.servers.get(serverName).closeAllConnections();
    this.servers.delete(serverName);
  }

  getServer(serverName) {
    return this.servers.get(serverName);
  }

  async getTable(serverName, tableName) {
    const server = this.getServer(serverName);
    return server.getTable(serverName, tableName);
  }

  setAutoSave(autoSave) {
    this.autoSave = autoSave;
    return this.autoSave;
  }

  getInstance() {
    return new DatabaseManagerInstance({
      DatabaseManager: this,
    });
  }
}

const databaseManager = new DatabaseManager();

module.exports = databaseManager;

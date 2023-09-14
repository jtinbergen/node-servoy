"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManagerInstance = void 0;
const JSDataSet_1 = require("./JSDataSet");
const JSFoundSet_1 = require("./JSFoundSet");
class DatabaseManagerInstance {
    constructor({ DatabaseManager }) {
        this.DatabaseManager = DatabaseManager;
        this.autoSave = false;
        this.aliasMapping = new Map();
    }
    aliasedServerName(serverName) {
        let mappedAlias = serverName;
        if (this.aliasMapping.has(serverName)) {
            mappedAlias = this.aliasMapping.get(serverName);
        }
        return mappedAlias;
    }
    async getTableNames(serverName) {
        const dataset = await this.getDataSetByQuery(serverName, "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'", [], -1);
        return dataset.getColumnAsArray(1);
    }
    getAutoSave() {
        return this.autoSave;
    }
    async getDatabaseProductName(serverName) {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        return server.getDatabaseProductName(() => { });
    }
    switchServer(sourceName, destinationName) {
        this.aliasMapping.set(sourceName, destinationName);
    }
    addTableFilterParam(serverName, tableName, dataprovider, operator, value, name) {
        this.globalFilters[serverName] = this.globalFilters[serverName] || [];
        this.globalFilters[serverName].push({
            serverName,
            tableName,
            dataprovider,
            operator,
            value,
            name,
        });
    }
    getTableFilterParams(serverName) {
        return this.globalFilters[serverName].map((filter) => [
            filter.tableName,
            filter.dataprovider,
            filter.operator,
            filter.value,
            filter.name,
        ]);
    }
    async getDataSetByQuery(serverName, sqlQuery, args, maxReturnedRows, callback) {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        const client = await server.getClient();
        const result = await client.getDataSetByQuery(sqlQuery, args, maxReturnedRows);
        if (callback) {
            callback(result);
        }
        return result;
    }
    async getFoundSet(serverName, tableName) {
        return new JSFoundSet_1.JSFoundSet({
            databaseManager: this,
            table: await this.DatabaseManager.getTable(serverName, tableName),
            serverName,
            tableName,
        });
    }
    createEmptyDataSet() {
        return new JSDataSet_1.JSDataSet();
    }
    startTransaction() {
        throw new Error('Not implemented');
    }
    rollbackTransaction() {
        throw new Error('Not implemented');
    }
    commitTransaction() {
        throw new Error('Not implemented');
    }
}
exports.DatabaseManagerInstance = DatabaseManagerInstance;
//# sourceMappingURL=DatabaseManagerInstance.js.map
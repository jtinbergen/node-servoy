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
        const dataset = await this.getDataSetByQuery(serverName, 'SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\'', [], -1);
        return dataset.getColumnAsArray(1);
    }

    getAutoSave() {
        return this.autoSave;
    }

    async getDatabaseProductName(serverName) {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        return server.getDatabaseProductName();
    }

    switchServer(sourceName, destinationName) {
        this.aliasMapping.set(sourceName, destinationName);
    }

    /**
     * Adds a filter to all the foundsets based on a table.
     *
     * Note: if null is provided as the tablename the filter will be applied on all tables with the dataprovider name.
     * A dataprovider can have multiple filters defined, they will all be applied. returns true if the tablefilter could be applied.
     *
     * Parameters
     * String serverName The name of the database server connection for the specified table name.
     * String tableName The name of the specified table.
     * String dataprovider A specified dataprovider column name.
     * String operator One of "=, <, >, >=, <=, !=, LIKE, or IN" optionally augmented with modifiers "#" (ignore case) or "^||" (or-is-null).
     */
    addTableFilterParam(serverName, tableName, dataprovider, operator, value, name) {
        this.globalFilters[serverName] = this.globalFilters[serverName] || [];
        this.globalFilters[serverName].push({ serverName, tableName, dataprovider, operator, value, name });
    }

    getTableFilterParams(serverName) {
        const filters = [];
        this.globalFilters[serverName].map(filter => [filter.tableName, filter.dataprovider, filter.operator, filter.value, filter.name]);
        return filters;
    }

    async getDataSetByQuery(serverName, sqlQuery, args, maxReturnedRows) {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        const client = await server.getClient();
        return client.getDataSetByQuery(sqlQuery, args, maxReturnedRows);
    }

    createEmptyDataSet() {
        return new JSDataSet();
    }

    startTransaction() {
        console.log('STUB: startTransaction');
    }

    rollbackTransaction() {
        console.warn('STUB: rollbackTransaction');
    }

    commitTransaction() {
        console.warn('STUB: commitTransaction');
    }
}

module.exports = DatabaseManagerInstance;

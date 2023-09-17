import { JSDataSet } from './JSDataSet';
import { JSFoundSet } from './JSFoundSet';
import { DatabaseManager } from './DatabaseManager';

type Filter = {
    serverName: string;
    tableName: string;
    dataprovider: string;
    operator: string;
    value: string;
    name: string;
};

export class DatabaseManagerInstance {
    DatabaseManager: DatabaseManager;
    autoSave: boolean;
    aliasMapping: Map<string, string>;
    globalFilters: { [key: string]: Filter[] };

    constructor({ DatabaseManager }: { DatabaseManager: DatabaseManager }) {
        this.DatabaseManager = DatabaseManager;
        this.autoSave = false;
        this.aliasMapping = new Map();
        this.globalFilters = {};
    }

    public aliasedServerName(serverName: string) {
        let mappedAlias = serverName;
        if (this.aliasMapping.has(serverName)) {
            const serverAlias = this.aliasMapping.get(serverName);
            if (serverAlias) {
                mappedAlias = serverAlias;
            }
        }

        return mappedAlias;
    }

    public async getTableNames(serverName: string) {
        const dataset = await this.getDataSetByQuery(
            serverName,
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
            [],
            -1,
        );
        return dataset.getColumnAsArray(1);
    }

    public getAutoSave() {
        return this.autoSave;
    }

    public async getDatabaseProductName(serverName: string) {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        if (!server) {
            throw new Error(`Server ${serverName} not found`);
        }

        return server.getDatabaseProductName(() => {});
    }

    public switchServer(sourceName: string, destinationName: string) {
        this.aliasMapping.set(sourceName, destinationName);
    }

    public addTableFilterParam(
        serverName: string,
        tableName: string,
        dataprovider: string,
        operator: string,
        value: string,
        name: string,
    ) {
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

    public getTableFilterParams(serverName: string) {
        return this.globalFilters[serverName].map((filter) => [
            filter.tableName,
            filter.dataprovider,
            filter.operator,
            filter.value,
            filter.name,
        ]);
    }

    public async getDataSetByQuery(
        serverName: string,
        sqlQuery: string,
        args: any[],
        maxReturnedRows: number,
        callback?: Function,
    ): Promise<JSDataSet> {
        const server = this.DatabaseManager.getServer(this.aliasedServerName(serverName));
        if (!server) {
            throw new Error(`Server ${serverName} not found`);
        }

        const client = await server.getClient();
        const result = await client.getDataSetByQuery(sqlQuery, args, maxReturnedRows);

        if (callback) {
            callback(result);
        }

        return result;
    }

    public async getFoundSet(serverName: string, tableName: string) {
        return new JSFoundSet({
            databaseManager: this,
            table: await this.DatabaseManager.getTable(serverName, tableName),
            serverName,
            tableName,
        });
    }

    public createEmptyDataSet() {
        return new JSDataSet();
    }

    public startTransaction() {
        throw new Error('Not implemented');
    }

    public rollbackTransaction() {
        throw new Error('Not implemented');
    }

    public commitTransaction() {
        throw new Error('Not implemented');
    }
}

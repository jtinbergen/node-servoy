import { DatabaseManagerInstance } from './DatabaseManagerInstance';
import { PostgresServer } from './PostgresServer';

type Server = {
    name: string;
    poolSize?: number;
    connectionString: string;
};

export class DatabaseManager {
    servers: Map<string, PostgresServer>;
    autoSave: boolean;

    constructor() {
        this.servers = new Map();
    }

    public registerServer(server: Server) {
        if (!server.name) {
            throw new Error('name property is required.');
        }

        if (!server.connectionString) {
            throw new Error('connectionString property is required.');
        }

        this.servers.set(
            server.name,
            new PostgresServer(this.getInstance(), {
                ...{ poolSize: 1, standbySize: 1 },
                ...server,
            }),
        );
    }

    public unregisterServer(serverName: string) {
        if (!serverName) {
            throw new Error('name property is required.');
        }

        this.servers.get(serverName).closeAllConnections();
        this.servers.delete(serverName);
    }

    public getServer(serverName: string) {
        return this.servers.get(serverName);
    }

    public async getTable(serverName: string, tableName: string) {
        const server = this.getServer(serverName);
        return server.getTable(serverName, tableName);
    }

    public setAutoSave(autoSave: boolean) {
        this.autoSave = autoSave;
        return this.autoSave;
    }

    public getInstance() {
        return new DatabaseManagerInstance({
            DatabaseManager: this,
        });
    }
}
